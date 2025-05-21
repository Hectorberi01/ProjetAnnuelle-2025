"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("../controllers/report.controller");
//import { createSection, getSections, updateSection } from "../controllers/report-section.controller";
const router = (0, express_1.Router)();
// Créer un rapport
router.post('/', report_controller_1.create);
// mettre à jour un rapport
router.put('/:id', report_controller_1.update);
// Récupérer tous les rapports
router.get('/', report_controller_1.getAll);
// Récupérer un rapport par son ID
router.get('/:id', report_controller_1.getById);
// Récupérer tous les rapports d'un projet
router.get('/projects/:projectId', report_controller_1.getByProject);
// suppression d'un rapport
router.delete('/:id', report_controller_1.deleteReport);
exports.default = router;
