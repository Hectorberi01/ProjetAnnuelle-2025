// routes/grids.ts
import { Router } from "express";
import { GradeGridController } from "../controllers/GradeGridController";

const router = Router();

// ➕ Créer une grille
router.post("/grids",GradeGridController.createGrid);

// ➕ Ajouter des critères
router.post("/grids/:id/criteria",GradeGridController.addCriteria);

// ✅ Finaliser une grille
router.post("/grids/:id/finalize", GradeGridController.finalize);

// 🔍 Détails d’une grille
router.get("/grids/:id", GradeGridController.getGrid);

export default router;