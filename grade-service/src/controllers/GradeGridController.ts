// controllers/GradeGridController.ts
import { Request, Response } from "express";
import { GradeGridService } from "../services/GradeGridService";

const service = new GradeGridService();

export class GradeGridController {

  static async createGrid(req: Request, res: Response) {
    const { projectId, name, type } = req.body;
    const grid = await service.createGrid(projectId, name, type);
    res.status(201).json(grid);
  }

  static async addCriteria(req: Request, res: Response) {
    const { id } = req.params;
    const { criteria } = req.body;
    const result = await service.addCriteria(Number(id), criteria);
    res.status(201).json(result);
  }

  static async finalize(req: Request, res: Response) {
    const { id } = req.params;
    const result = await service.finalizeGrid(Number(id));
    res.status(200).json(result);
  }

  static async getGrid(req: Request, res: Response) {
    const { id } = req.params;
    const result = await service.getGrid(Number(id));
    res.status(200).json(result);
  }
  
}