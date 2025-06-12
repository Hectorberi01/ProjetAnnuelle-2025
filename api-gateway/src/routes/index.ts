import { Router } from 'express';
import authRoutes from './authRoutes';
import promotionRoutes from './promotionRoutes';
import projectRoutes from './projectRoutes';
import groupRoutes from './groupRoutes';
import reportRoutes from './reportRoutes';
import deliverableRoutes from './deliverableRoutes';
import soutenanceRoutes from './soutenanceRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/promotions', promotionRoutes);
router.use('/api/projects', projectRoutes);
router.use('/api/groups', groupRoutes);
router.use('/api/reports', reportRoutes);
router.use('/api/livrables', deliverableRoutes);
router.use('/api/soutenances', soutenanceRoutes);
router.use('/api/users', userRoutes);

export default router;