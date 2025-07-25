
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

// notation.controller.ts
finalizeNotation = async (req: Request, res: Response) => {
  try {
    console.log("Reçu:", req.body); // Log du payload reçu

    const { projectId, groupId } = req.params;
    const userId = req.headers['user-id'] as string;
    
    // Validation des données
    if (!req.body.notes || !Array.isArray(req.body.notes)) {
      throw new Error("Le format des notes est invalide");
    }

    const notation = await this.notationService.finalizeNotation(
      projectId, 
      groupId, 
      {
        notes: req.body.notes,
        commentairesGlobaux: req.body.commentairesGlobaux || {},
        commentaireProjet: req.body.commentaireProjet || ""
      },
      userId
    );

    res.json(notation);
  } catch (error) {
    console.error("Erreur complète:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    res.status(400).json({ 
      error: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    });
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

  saveNotation = async (req: Request, res: Response) => {
    const { projectId, groupId, studentId, noteFinale, commentaire } = req.body;

    try {
      if (!projectId || !groupId  || noteFinale === undefined) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      const notation = await this.notationService.saveNotation(projectId, groupId, {
        studentId,
        noteFinale,
        commentaire
      });

      res.status(201).json(notation);
    } catch (e) {
        

   
    }

  };





}