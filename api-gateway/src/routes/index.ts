import { Router } from 'express';
import authRoutes from './authRoutes';
import promotionRoutes from './promotionRoutes';
import projectRoutes from './projectRoutes';
import groupRoutes from './groupRoutes';
import { report } from 'process';
import reportRoutes from './reportRoutes';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/promotions',promotionRoutes);
router.use('/api/projects', projectRoutes);
router.use('/api/groups',groupRoutes); 
router.use('/api/reports',reportRoutes);

export default router;