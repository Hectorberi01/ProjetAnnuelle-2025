import { Request, Response } from "express";
import { NotationService } from "../services/notation.service";
import { notationSchema } from "../validation/validation";

const service = new NotationService();

export class NotationController {
  static async create(req: Request, res: Response) {
    try {
      const parsed = notationSchema.parse(req.body);
      const parsedWithDefaults = {
        ...parsed,
        criteria: parsed.criteria.map((criterion: any) => ({
          ...criterion,
          id: criterion.id || 0, // Provide a default id
          grid: criterion.grid || null, // Provide a default grid
        })),
      };
      const saved = await service.create(parsedWithDefaults);
                                                                                                                                                                                                                                                                                                                                                                               res.status(201).json(saved);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    const result = await service.getAll();
    res.json(result);
  }

  static async getById(req: Request, res: Response): Promise<any>  {
    const id = parseInt(req.params.id);
    const result = await service.getById(id);
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json(result);
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await service.delete(id);
    res.status(204).send();
  }
}
