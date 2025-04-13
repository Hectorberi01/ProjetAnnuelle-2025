import { Request, Response,NextFunction, RequestHandler } from 'express';
import * as AuthService from '../services/auth.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const register = async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  res.status(result.status).json(result.data);
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("email", email);
    console.log("password", password)
    const result = await AuthService.login(req.body);
    res.status(result.status).json(result.data);
};

export const logout = async (_: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req: Request, res: Response) => {
    console.log("req.body", req.body);
    const { Email } = req.body;
    const result = await AuthService.forgotPassword(Email);
    res.status(result.status).json(result.data);
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    const result = await AuthService.resetPassword(token, newPassword);
    res.status(result.status).json(result.data);
};

export const me = (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({ user: req.user });
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        const result = await AuthService.refreshToken(refreshToken);
        res.status(result.status).json(result.data);
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.body;
    const result = await AuthService.verifyEmail(token);
    res.status(result.status).json(result.data);
};

export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    const result = await AuthService.changePassword(userId, oldPassword, newPassword);
    res.status(result.status).json(result.data);
};

export const checkToken = (req: Request, res: Response) => {
    const { token } = req.body;
    const result = AuthService.checkToken(token);
    res.status(result.status).json(result.data);
};