// controllers/GradeController.ts
import { Request, Response } from "express";
import { GradeService } from "../services/GradeService";

const service = new GradeService();

export class GradeController {
  static async submitGrades(req: Request, res: Response) {
    const { gridId, groupId } = req.params;
    const { grades } = req.body;
    const result = await service.submitGrades(+gridId, +groupId, grades);
    res.status(201).json(result);
  }

  static async addGlobalComment(req: Request, res: Response) {
    const { gridId, groupId } = req.params;
    const { content } = req.body;
    const result = await service.addGlobalComment(+gridId, +groupId, content);
    res.status(201).json(result);
  }

  static async getGrades(req: Request, res: Response) {
    const { groupId } = req.params;
    const result = await service.getGradesForGroup(+groupId);
    res.status(200).json(result);
  }
}