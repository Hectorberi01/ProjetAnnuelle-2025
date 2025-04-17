import { Router } from "express";
import { NotationController } from "../controllers/notation.controller";

const router = Router();

router.post("/", NotationController.create);
router.get("/", NotationController.getAll);
router.get("/:id", NotationController.getById);
router.delete("/:id", NotationController.delete);

export default router;
