// routes/grades.ts
import { Router } from "express";
import { GradeController } from "../controllers/GradeController";

const router = Router();

// ✏️ Soumettre les notes d’un groupe
router.post(
  "/grades/:gridId/group/:groupId",GradeController.submitGrades);

// ✍️ Ajouter un commentaire global
router.post("/grades/:gridId/group/:groupId/comment",GradeController.addGlobalComment);

// 🔍 Récupérer les notes d’un groupe
router.get("/grades/group/:groupId", GradeController.getGrades);

export default router;