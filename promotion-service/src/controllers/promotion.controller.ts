import { Request, Response } from "express";
import { PromotionService } from "../services/promotion.service";

const service = new PromotionService();

export class PromotionController {
  static async create(req: Request, res: Response) {
    const { name, year } = req.body;
    const promotion = await service.create(name, year);
    res.status(201).json(promotion);
  }

  static async getAll(req: Request, res: Response) {
    const promotions = await service.findAll();
    res.json(promotions);
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const promotion = await service.findById(id);
    if (!promotion){
       res.status(404).json({ message: "Not found" });
       return
    } 
    res.json(promotion);
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await service.update(id, req.body);
    res.json(updated);
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    await service.delete(id);
    res.status(204).send();
  }
}