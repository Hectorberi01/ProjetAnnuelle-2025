import express from "express";
import { prisma } from "../../utils/prisma";
import {
  userPatchValidation,
  userValidation,
} from "../validators/user-validator";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middlewares/auth-middleware";
import { createResetPasswordToken } from "../services/email-service";
import { authzMiddleware } from "../middlewares/authz-middleware";

export const initUsers = (app: express.Express) => {
  app.get("/users/me", authMiddleware, async (req: any, res) => {
    try {
      const user = await prisma.users.findUnique({
        where: { id: Number(req.payload.userId) },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isSuperAdmin: true,
        },
      });
      res.status(200).json(user);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/users", authMiddleware, authzMiddleware, async (req, res) => {
    try {
      const allUsers = await prisma.users.findMany();
      res.json(allUsers);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/users/:id", authMiddleware, authzMiddleware, async (req, res) => {
    try {
      const user = await prisma.users.findUnique({
        where: { id: Number(req.params.id) },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isSuperAdmin: true,
          createdAt: true,
          memberships: {
            select: {
              role: true,
              isAdmin: true,
              organization: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
        },
      });
      res.json(user);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.post("/users", async (req, res) => {
    const validation = userValidation.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error });
      return;
    }

    const userRequest = validation.value;
    userRequest.password = await bcrypt.hash(userRequest.password, 10);
    try {
      const user = await prisma.users.create({
        data: {
          firstName: userRequest.firstName,
          lastName: userRequest.lastName,
          email: userRequest.email,
          password: userRequest.password,
          isSuperAdmin: userRequest.isSuperAdmin,
        },
      });
      res.json(user);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.patch("/users/:id", async (req, res) => {
    const validation = userPatchValidation.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const userRequest = validation.value;
    try {
      const user = await prisma.users.update({
        where: {
          id: Number(req.params.id),
        },
        data: userRequest,
      });
      res.json(user);
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

  app.delete("/users/:id", async (req, res) => {
    try {
      const deletedUser = await prisma.users.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedUser);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });

  app.post("/forgot-password", async (req, res) => {
    try {
      const email = req.body.email;
      const user = await prisma.users.findUnique({
        where: { email: email },
      });
      if (!user) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      await createResetPasswordToken(email);

      res.status(200).send({ message: "Password reset email sent" });
    } catch (e) {
      console.error("Error sending reset password email:", e);
      res.status(500).send({ error: e });
    }
  });

  app.post("users/:id/reset-password", authzMiddleware, async (req, res) => {
    try {
      const { id } = req.params;

      const user = await prisma.users.findUnique({
        where: { id: Number(id) },
      });

      if (!user) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      await createResetPasswordToken(user.email);

      res.status(200).send({ message: "Password reset email sent" });
    } catch (e) {
      console.error("Error sending reset password email:", e);
      res.status(500).send({ error: e });
    }
  });

  app.post("/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      const resetPasswordToken = await prisma.resetPasswordTokens.findUnique({
        where: { token },
      });
      if (!resetPasswordToken) {
        res.status(404).send({ error: "Token not found" });
        return;
      }
      if (resetPasswordToken.expiresAt < new Date()) {
        res.status(403).send({ error: "Token expired" });
        return;
      }
      const user = await prisma.users.findUnique({
        where: { id: resetPasswordToken.userId },
      });
      if (!user) {
        res.status(404).send({ error: "User not found" });
        return;
      }
      const newPassword = await bcrypt.hash(password, 12);
      await prisma.users.update({
        where: { id: user.id },
        data: { password: newPassword },
      });
      res.status(200).send({ message: "Password updated" });
    } catch (e) {
      console.error("Error updating password:", e);
      res.status(500).send({ error: e });
    }
  });
};
