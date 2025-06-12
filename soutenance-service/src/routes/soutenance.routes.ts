import { Router } from 'express';
import { SoutenanceController } from '../controllers/soutenanceController';

const router = Router();

router.post('/', SoutenanceController.generate);
router.get('/:projectId', SoutenanceController.get);
router.put('/:id', SoutenanceController.update);

export default router;
