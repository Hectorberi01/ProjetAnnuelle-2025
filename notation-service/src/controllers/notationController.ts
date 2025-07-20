
import { Request, Response } from 'express';
// Update the path below if NotationService is located elsewhere
import { NotationService } from '../services/Notationservice';
export class NotationController {
  private notationService: NotationService;

  constructor() {
    this.notationService = new NotationService();
  }

  getNotation = async (req: Request, res: Response) => {
    try {
      const { projectId, groupId } = req.params;
      const notation = await this.notationService.getNotationGroupe(projectId, groupId);
      res.json(notation);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: errorMessage });
    }
  };

  saveNoteCritere = async (req: Request, res: Response) => {
    try {
      const { projectId, groupId } = req.params;
      const note = await this.notationService.saveNoteCritere(projectId, groupId, req.body);
      res.json(note);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  };


  saveCommentaireGlobal = async (req: Request, res: Response) => {
    try {
      const { projectId, groupId } = req.params;
      const commentaire = await this.notationService.saveCommentaireGlobal(projectId, groupId, req.body);
      res.json(commentaire);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  };

  finalizeNotation = async (req: Request, res: Response) => {
    try {
      const { projectId, groupId } = req.params;
      const userId = req.headers['user-id'] as string; // À adapter selon votre système d'auth
      const notation = await this.notationService.finalizeNotation(projectId, groupId, req.body, userId);
      res.json(notation);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  };


validateSpecificGrille = async (req: Request, res: Response) => {
    try {
      const { projectId, groupId, grilleId } = req.params;
      const result = await this.notationService.validateSpecificGrille(projectId, groupId, grilleId);
      res.json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  };

  publishProjectGrades = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const result = await this.notationService.publishProjectGrades(projectId);
      res.json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  };

  getGradingGridByProjectAndGroup = async (req: Request, res: Response) => {
    try {
      const { projectId, groupId } = req.params;
      const result = await this.notationService.getGradingGridByProjectAndGroup(projectId, groupId);
      res.json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  };









}