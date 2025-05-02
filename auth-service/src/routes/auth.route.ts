

import { Router } from 'express';
import {register,login,logout,forgotPassword,me, changePassword,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);

router.get('/me', authMiddleware, me);

router.post('/change-password', authMiddleware, changePassword);

export default router;