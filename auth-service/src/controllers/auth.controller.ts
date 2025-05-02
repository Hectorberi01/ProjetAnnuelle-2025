import { Request, Response,NextFunction, RequestHandler } from 'express';
import * as AuthService from '../services/auth.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

//OK
export const register = async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  res.status(result.status).json(result.data);
};

export const login = async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    res.status(result.status).json(result.data);
};

export const logout = async (_: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    res.status(result.status).json(result.data);
};


export const me = (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({ user: req.user });
};


export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.user.id;
    const result = await AuthService.changePassword(userId, oldPassword, newPassword);
    res.status(result.status).json(result.data);
};