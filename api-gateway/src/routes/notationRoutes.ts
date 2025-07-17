
import { Router } from 'express';
import {
  getProjectGradingGrids,
  createGradingGrid,
  calculateFinalScore,
  publishGrades,
  getStudentGrades,
  getProjectGrades,
  getGradingGrid,
  updateGradingGrid,
  validateGradingGrid,
  createCriteria,
  getCriteriaByProject,
  updateCriteria,
  deleteCriteria,
  submitGradesForGrid,
  updateStudentGrade,
  getGradingGridById
} from '../services/notationService';

const router = Router();

// --- Critères ---
router.post('/criteria', async (req, res) => {
  try {
    const result = await createCriteria(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create criteria' });
  }
});

router.get('/criteria/project/:projectId', async (req, res) => {
  try {
    const result = await getCriteriaByProject(req.params.projectId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch criteria' });
  }
});

router.put('/criteria/:criteriaId', async (req, res) => {
  try {
    const result = await updateCriteria(req.params.criteriaId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update criteria' });
  }
});

router.delete('/criteria/:criteriaId', async (req, res) => {
  try {
    await deleteCriteria(req.params.criteriaId);
    res.status(200).json({ message: 'Criteria deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete criteria' });
  }
});

// --- Grilles de notation ---
router.post('/grids', async (req, res) => {
  try {
    const result = await createGradingGrid(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create grading grid' });
  }
});

router.get('/grids/:projectId/:groupId/:type/:referenceId', async (req, res) => {
  const { projectId, groupId, type, referenceId } = req.params;
  try {
    const result = await getGradingGrid(projectId, groupId, type, referenceId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch grading grid' });
  }
});

router.put('/grids/:gridId', async (req, res) => {
  try {
    const result = await updateGradingGrid(req.params.gridId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update grading grid' });
  }
});

router.put('/grids/:gridId/validate', async (req, res) => {
  try {
    const result = await validateGradingGrid(req.params.gridId, req.body.teacherId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to validate grading grid' });
  }
});

router.get('/grids/project/:projectId', async (req, res) => {
  try {
    const result = await getProjectGradingGrids(req.params.projectId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project grading grids' });
  }
});

// --- Notes finales ---
router.get('/score/:projectId/:groupId', async (req, res) => {
  try {
    const score = await calculateFinalScore(req.params.projectId, req.params.groupId);
    res.status(200).json({ finalScore: score });
  } catch (error) {
    res.status(500).json({ message: 'Failed to calculate final score' });
  }
});

router.put('/publish/:projectId', async (req, res) => {
  try {
    await publishGrades(req.params.projectId);
    res.status(200).json({ message: 'Grades published successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to publish grades' });
  }
});

router.get('/student/:studentId/project/:projectId', async (req, res) => {
  try {
    const result = await getStudentGrades(req.params.studentId, req.params.projectId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student grades' });
  }
});

router.get('/grades/project/:projectId', async (req, res) => {
  try {
    const result = await getProjectGrades(req.params.projectId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project grades' });
  }
});
router.post('/grids/:gridId/submit', async (req, res) => {
  try {
     const result = await submitGradesForGrid(req.params.gridId, req.body);
     res.status(200).json(result);
  } catch (error) {
    console.error('Erreur route submitGradesForGrid:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la soumission des notes' });
  }
});
router.get('/grids/id/:gridId', async (req, res) => {
  try {
    const result = await getGradingGridById(req.params.gridId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch grading grid by ID' });
  }
});
router.put('/final-score', async (req, res) => {
  const { projectId, studentId, groupId } = req.body;
  try {
    const result = await updateStudentGrade(projectId, studentId, groupId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student final score' });
  }
});


export default router;
