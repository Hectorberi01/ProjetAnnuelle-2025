import { Router } from 'express';
import { GradingController } from '../controllers/gradingController';

const router = Router();
const gradingController = new GradingController();

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

export default router;