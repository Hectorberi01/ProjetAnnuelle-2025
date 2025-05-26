import { Request, Response,NextFunction, RequestHandler } from 'express';
import * as AuthService from '../services/auth.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

//OK
export const register = async (req: Request, res: Response) => {
  try {

    const result = await AuthService.register(req.body);

    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// register admin
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.createAdminUser(req.body);
    res.status(201).json({ message: 'Admin user created successfully', data: result });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log('Login request received:', { email, password });
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }


  const result = await AuthService.login({ email, password });
  
  console.log('Login result:', result);
  res.status(200).json(result.data);
};

// Logout
export const logout = async (_: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    const result = await AuthService.forgotPassword(email);
    if (result.status === 200) {
      res.status(200).json({ message: 'Email de réinitialisation envoyé' });
    } else {
      res.status(result.status).json(result.data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const me = (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({ user: req.user });
};

// Change password
export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: 'Old password and new password are required' });
      return;
    }

    const userId = req.user.user.id;
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    const result = await AuthService.changePassword(userId, oldPassword, newPassword);
    if (result.status === 200) {
      res.status(200).json({ message: 'Password changed successfully' });
    } else {
      res.status(result.status).json(result.data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};