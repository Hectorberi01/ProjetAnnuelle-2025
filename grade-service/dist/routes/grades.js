"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/grades.ts
const express_1 = require("express");
const GradeController_1 = require("../controllers/GradeController");
const router = (0, express_1.Router)();
// ✏️ Soumettre les notes d’un groupe
router.post("/grades/:gridId/group/:groupId", GradeController_1.GradeController.submitGrades);
// ✍️ Ajouter un commentaire global
router.post("/grades/:gridId/group/:groupId/comment", GradeController_1.GradeController.addGlobalComment);
// 🔍 Récupérer les notes d’un groupe
router.get("/grades/group/:groupId", GradeController_1.GradeController.getGrades);
exports.default = router;
