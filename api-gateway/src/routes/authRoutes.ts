import { Router } from 'express';
import { LoginUser } from '../services/authService';

const router = Router();

router.post('/login', async (req, res, next) => {
    try {
        const data = await LoginUser(req.body);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

export default router;