"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/grids.ts
const express_1 = require("express");
const GradeGridController_1 = require("../controllers/GradeGridController");
const router = (0, express_1.Router)();
// ➕ Créer une grille
router.post("/grids", GradeGridController_1.GradeGridController.createGrid);
// ➕ Ajouter des critères
router.post("/grids/:id/criteria", GradeGridController_1.GradeGridController.addCriteria);
// ✅ Finaliser une grille
router.post("/grids/:id/finalize", GradeGridController_1.GradeGridController.finalize);
// 🔍 Détails d’une grille
router.get("/grids/:id", GradeGridController_1.GradeGridController.getGrid);
exports.default = router;
