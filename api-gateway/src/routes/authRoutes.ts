import { Router } from 'express';
import { changePassword, forgotPassword, LoginUser, RegisterAdminUser, RegisterUser } from '../services/authService';

const router = Router();

router.post('/login', async (req, res, next) => {
    try {
        const data = await LoginUser(req.body);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.post('/register', async (req, res, next) => {
    console.log("Register endpoint hit with body:", req.body);
    try {
        const data = await RegisterUser(req.body);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.post('/register-admin', async (req, res, next) => {
    try {
        const data = await RegisterAdminUser(req.body);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.post('/forgot-password', async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }
        const data = await forgotPassword(email);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// change-password endpoint is not implemented in the original code, so it is omitted here.
router.post('/change-password', async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            res.status(400).json({ error: 'Old and new passwords are required' });
            return;
        }
        // Implement change password logic here
        const response = await changePassword(req.body.userId, oldPassword, newPassword);
        if (!response ) {
            res.status(400).json({ error: 'Failed to change password' });
            return;
        }
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        next(err);
    }
});

export default router;