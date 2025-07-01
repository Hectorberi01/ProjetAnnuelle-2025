import { Router } from "express";
import { PromotionController } from "../controllers/promotion.controller";

const router = Router();

router.post("/", PromotionController.create);
router.post("/:id/students", PromotionController.addStudentToPromotion);
router.get("/students/:id", PromotionController.getByStudentId);
router.get("/", PromotionController.getAll);
router.get("/:id", PromotionController.getById);
router.put("/:id", PromotionController.update);
router.delete("/:id", PromotionController.delete);

export default router;