import express from 'express';
import { PromotionController } from '../controllers/promotion.controller';

const router = express.Router();

router.post('/', PromotionController.createPromotion);
router.get('/', PromotionController.getPromotions);
router.get('/:id', PromotionController.getPromotionById);

router.delete('/:id', PromotionController.deletePromotion);

export default router;
