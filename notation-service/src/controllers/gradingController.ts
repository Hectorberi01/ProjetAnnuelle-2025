import { Request, Response } from 'express';
import { GradingService } from '../services/gradingService';

export class GradingController {
  private gradingService: GradingService;

  constructor() {
    this.gradingService = new GradingService();
  }

  // Critères de notation
  createCriteria = async (req: Request, res: Response): Promise<void> => {
    try {
      const criteria = await this.gradingService.createCriteria(req.body);
      res.status(201).json(criteria);
    } catch (error) {
      res.status(400).json({ error: 'Erreur lors de la création du critère' });
    }
  };

  getCriteriaByProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      const criteria = await this.gradingService.getCriteriaByProject(projectId);
      res.json(criteria);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des critères' });
    }
  };

  updateCriteria = async (req: Request, res: Response): Promise<void> => {
    try {
      const { criteriaId } = req.params;
      const criteria = await this.gradingService.updateCriteria(criteriaId, req.body);
      if (!criteria) {
        res.status(404).json({ error: 'Critère non trouvé' });
        return;
      }
      res.json(criteria);
    } catch (error) {
      res.status(400).json({ error: 'Erreur lors de la mise à jour du critère' });
    }
  };

  deleteCriteria = async (req: Request, res: Response): Promise<void> => {
    try {
      const { criteriaId } = req.params;
      const success = await this.gradingService.deleteCriteria(criteriaId);
      if (!success) {
        res.status(404).json({ error: 'Critère non trouvé' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression du critère' });
    }
  };

  // Grilles de notation
  createGradingGrid = async (req: Request, res: Response): Promise<void> => {
    try {
      const grid = await this.gradingService.createGradingGrid(req.body);
      res.status(201).json(grid);
    } catch (error) {
      res.status(400).json({ error: 'Erreur lors de la création de la grille' });
    }
  };

  getGradingGrid = async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId, groupId, type, referenceId } = req.params;
      const grid = await this.gradingService.getGradingGrid(projectId, groupId, type, referenceId);
      if (!grid) {
        res.status(404).json({ error: 'Grille non trouvée' });
        return;
      }
      res.json(grid);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de la grille' });
    }
  };

  updateGradingGrid = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gridId } = req.params;
      const grid = await this.gradingService.updateGradingGrid(gridId, req.body);
      if (!grid) {
        res.status(404).json({ error: 'Grille non trouvée' });
        return;
      }
      res.json(grid);
    } catch (error) {
      res.status(400).json({ error: 'Erreur lors de la mise à jour de la grille' });
    }
  };

  validateGradingGrid = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gridId } = req.params;
      const { teacherId } = req.body;
      const grid = await this.gradingService.validateGradingGrid(gridId, teacherId);
      if (!grid) {
        res.status(404).json({ error: 'Grille non trouvée' });
        return;
      }
      res.json(grid);
    } catch (error) {
      res.status(400).json({ error: 'Erreur lors de la validation de la grille' });
    }
  };

  getProjectGradingGrids = async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      const grids = await this.gradingService.getProjectGradingGrids(projectId);
      res.json(grids);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des grilles' });
    }
  };

  // Notes finales
  calculateFinalScore = async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId, groupId } = req.params;
      const score = await this.gradingService.calculateFinalScore(projectId, groupId);
      res.json({ finalScore: score });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors du calcul de la note finale' });
    }
  };

  publishGrades = async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      await this.gradingService.publishGrades(projectId);
      res.json({ message: 'Notes publiées avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la publication des notes' });
    }
  };

  getStudentGrades = async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId, projectId } = req.params;
      const grades = await this.gradingService.getStudentGrades(studentId, projectId);
      if (!grades) {
        res.status(404).json({ error: 'Notes non trouvées' });
        return;
      }
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
    }
  };

  getProjectGrades = async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      const grades = await this.gradingService.getProjectGrades(projectId);
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des notes du projet' });
    }
  };
}