"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gradingController_1 = require("../controllers/gradingController");
const router = (0, express_1.Router)();
const gradingController = new gradingController_1.GradingController();
// Routes pour les critères
router.post('/criteria', gradingController.createCriteria);
router.get('/criteria/project/:projectId', gradingController.getCriteriaByProject);
router.put('/criteria/:criteriaId', gradingController.updateCriteria);
router.delete('/criteria/:criteriaId', gradingController.deleteCriteria);
// Routes pour les grilles de notation
router.post('/grids', gradingController.createGradingGrid);
router.get('/grids/:projectId/:groupId/:type/:referenceId', gradingController.getGradingGrid);
router.put('/grids/:gridId', gradingController.updateGradingGrid);
router.put('/grids/:gridId/validate', gradingController.validateGradingGrid);
router.get('/grids/project/:projectId', gradingController.getProjectGradingGrids);
// Routes pour les notes finales
router.get('/scores/:projectId/:groupId', gradingController.calculateFinalScore);
router.put('/grades/:projectId/publish', gradingController.publishGrades);
router.get('/grades/student/:studentId/project/:projectId', gradingController.getStudentGrades);
router.get('/grades/project/:projectId', gradingController.getProjectGrades);
exports.default = router;
