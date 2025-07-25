import { Request, Response } from 'express';
import { GrilleService } from '../services/GrilleService';

export class GrilleController {
  getRecap(arg0: string, getRecap: any) {
    throw new Error('Method not implemented.');
  }
  private grilleService: GrilleService;

  constructor() {
    this.grilleService = new GrilleService();
  }

  getGrilles = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const grilles = await this.grilleService.getGrillesByProject(projectId);
      res.json(grilles);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: errorMessage });
    }
  };


  getGrillesCritere = async (req: Request, res: Response) => {
    try {
      const {grilleId  } = req.params;
      const critere = await this.grilleService.getCriteresByGrille(grilleId);
      res.json(critere);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: errorMessage });
    }
  };
  createGrille = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const grille = await this.grilleService.createGrille(projectId, req.body);
      res.status(201).json(grille);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  };
createCritere = async (req: Request, res: Response) => {
    try {
        const { projectId, groupId } = req.params;
        const critere = await this.grilleService.createCritere(projectId, groupId, req.body);
        res.status(201).json(critere);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(400).json({ error: errorMessage });
    }
};
  updateGrille = async (req: Request, res: Response) => {
    try {
      const { grilleId } = req.params;
      const grille = await this.grilleService.updateGrille(grilleId, req.body);
      res.json(grille);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  };

  deleteGrille = async (req: Request, res: Response) => {
    try {
      const { grilleId } = req.params;
      await this.grilleService.deleteGrille(grilleId);
      res.status(204).send();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  };
  deleteCritere = async (req: Request, res: Response) => {
      try {
        const { grilleId } = req.params;
        await this.grilleService.deleteCritere(grilleId, req.params.critereId);
        res.status(204).send();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(400).json({ error: errorMessage });
      }
    }
    validateGrille = async (req: Request, res: Response) => {
      try {
        const { grilleId } = req.params;
        const grille = await this.grilleService.validateGrille(grilleId);
        res.json(grille);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(400).json({ error: errorMessage });
      }
    };
  updateCritere = async (req: Request, res: Response) => {
    try {
      const { grilleId, critereId } = req.params;
      const updated = await this.grilleService.updateCritere(grilleId, parseInt(critereId), req.body);
      res.status(200).json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }


}

