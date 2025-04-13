

import { Router } from 'express';
import {register,login,logout,forgotPassword,me,refreshToken, resetPassword, verifyEmail, changePassword, checkToken,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.get('/me', authMiddleware, me);

router.post('/refresh-token', refreshToken);

router.post('/verify-email', verifyEmail);

router.post('/change-password', authMiddleware, changePassword);

router.post('/check-token', checkToken);

export default router;