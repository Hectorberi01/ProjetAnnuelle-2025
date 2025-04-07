import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { generateTokens, hashToken } from "../../utils/token";
import { authMiddleware } from "../middlewares/auth-middleware";
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findMembersByUserId,
  findRefreshTokenById,
  revokeTokens,
} from "../services/auth-services";
import {
  findUserByEmail,
  findUserById,
  getSafeUserById,
  verifyUserPassword,
} from "../services/users-services";
import {
  loginValidation,
  refreshTokenValidation,
  revokeRefreshTokenValidation,
  signupValidation,
} from "../validators/auth-validator";
import { prisma } from "../../utils/prisma";
import { createResetPasswordToken } from "../services/email-service";

export const initAuth = (app: express.Express) => {
  app.post(
    "/auth/login",
    async (req: express.Request, res: express.Response) => {
      try {
        const validation = loginValidation.validate(req.body);
        if (validation.error) {
          return res.status(400).send({ error: validation.error });
        }

        const loginRequest = validation.value;
        const user = await verifyUserPassword(
          loginRequest.email,
          loginRequest.password
        );

        if (!user) {
          return res.status(403).send({ error: "Invalid login credentials" });
        }

        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(
          user,
          jti,
          user.memberships
        );
        await addRefreshTokenToWhitelist({
          jti,
          refreshToken,
          userId: user.id,
        });

        req.headers.authorization = `Bearer ${accessToken}`;
        return res.json({ accessToken, refreshToken });
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
      }
    }
  );

  app.post(
    "/auth/refreshToken",
    async (req: express.Request, res: express.Response) => {
      try {
        const validation = refreshTokenValidation.validate(req.body);
        if (validation.error) {
          return res.status(400).send({ error: validation.error });
        }

        const refreshTokenRequest = validation.value;
        const payload: any = jwt.verify(
          refreshTokenRequest.token,
          process.env.JWT_REFRESH_SECRET!
        );
        const savedRefreshToken = await findRefreshTokenById(payload.jti);
        if (!savedRefreshToken || savedRefreshToken.revoked === true) {
          return res.status(401).send({ error: "Refresh token revoked" });
        }

        const hashedToken = hashToken(refreshTokenRequest.token);
        if (hashedToken !== savedRefreshToken.hashed_token) {
          return res.status(401).send({ error: "Refresh token invalid" });
        }

        const user = await getSafeUserById(payload.userId);
        if (!user) {
          return res.status(401).send({ error: "Refresh token invalid" });
        }

        await deleteRefreshToken(savedRefreshToken.id);
        const jti = uuidv4();
        const userMemberships = user.memberships;
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(
          user,
          jti,
          userMemberships
        );
        await addRefreshTokenToWhitelist({
          jti,
          refreshToken: newRefreshToken,
          userId: user.id,
        });

        return res.json({
          accessToken,
          refreshToken: newRefreshToken,
        });
      } catch (error) {
        return res.status(400).send({ error: "Refresh token invalid" });
      }
    }
  );

  app.post(
    "/auth/revokeRefreshToken",
    async (req: express.Request, res: express.Response) => {
      try {
        const validation = revokeRefreshTokenValidation.validate(req.body);
        if (validation.error) {
          return res.status(400).send({ error: validation.error });
        }

        const revokeRefreshTokenRequest = validation.value;
        await revokeTokens(revokeRefreshTokenRequest.userId);

        return res.json({
          message: `Refresh token revoked for user with id #${revokeRefreshTokenRequest.userId}`,
        });
      } catch (error) {
        return res.status(500).send({ error: error });
      }
    }
  );

  app.get(
    "/auth/check",
    authMiddleware,
    async (req: express.Request, res: express.Response) => {
      try {
        const payload = (req as any).payload;
        return res.json(payload);
      } catch (error) {
        return res.status(500).send({ error: error });
      }
    }
  );
  app.post(
    "/auth/forgot-password",
    async (req: express.Request, res: express.Response) => {
      try {
        const { email } = req.body;
        await createResetPasswordToken(email);
        res.status(200).json({
          message:
            "If an account with that email exists, we have sent a password reset link.",
        });
      } catch (error) {
        console.error("Forgot password error:", error);
        res
          .status(500)
          .json({ error: "An error occurred while processing your request." });
      }
    }
  );

  app.post(
    "/auth/reset-password",
    async (req: express.Request, res: express.Response) => {
      try {
        const { token, newPassword } = req.body;
        const resetToken = await prisma.resetPasswordTokens.findUnique({
          where: { token },
          include: { user: true },
        });

        if (!resetToken || resetToken.expiresAt < new Date()) {
          return res.status(400).json({ error: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.users.update({
          where: { id: resetToken.userId },
          data: { password: hashedPassword },
        });

        await prisma.resetPasswordTokens.delete({
          where: { userId: resetToken.userId },
        });

        res
          .status(200)
          .json({ message: "Password has been reset successfully" });
      } catch (error) {
        console.error("Reset password error:", error);
        res
          .status(500)
          .json({ error: "An error occurred while resetting your password." });
      }
    }
  );

  app.post(
    "/auth/signup",
    async (req: express.Request, res: express.Response) => {
      try {
        const validation = signupValidation.validate(req.body);
        if (validation.error) {
          return res.status(400).send({ error: validation.error });
        }

        const signupRequest = validation.value;
        const existingUser = await findUserByEmail(signupRequest.email);
        if (existingUser) {
          return res.status(400).send({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(signupRequest.password, 10);
        const user = await prisma.users.create({
          data: {
            firstName: signupRequest.firstName,
            lastName: signupRequest.lastName,
            email: signupRequest.email,
            password: hashedPassword,
          },
        });

        const usertoken = await getSafeUserById(user.id);
        if (!usertoken) {
          return res
            .status(500)
            .send({
              error: "An error occurred during signup while getting user",
            });
        }

        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(
          usertoken,
          jti,
          []
        );
        await addRefreshTokenToWhitelist({
          jti,
          refreshToken,
          userId: user.id,
        });

        return res.json({ accessToken, refreshToken });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .send({ error: "An error occurred during signup" });
      }
    }
  );
};
