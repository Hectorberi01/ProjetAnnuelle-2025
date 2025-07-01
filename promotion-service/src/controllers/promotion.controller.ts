import { Request, Response } from "express";
import { PromotionService } from "../services/promotion.service";

const service = new PromotionService();

export class PromotionController {
  static async create(req: Request, res: Response) {
    const { name, startYear,endYear} = req.body;
    const promotion = await service.create(name, startYear, endYear);
    res.status(201).json(promotion);
  }

  static async addStudentToPromotion(req: Request, res: Response) {
    const promotionId = Number(req.params.id);
    console.log("promotionId", promotionId);
    const studentId = Number(req.body.studentId);
    console.log("studentId", studentId);
    const promotionStudent = await service.addStudentToPromotion(promotionId, studentId);
    res.status(201).json(promotionStudent);
  }

  static async getAll(req: Request, res: Response) {
    const promotions = await service.findAll();
    res.json(promotions);
  }

  static async getByStudentId(req: Request, res: Response) {
    const studentId = Number(req.params.id);
    const promotions = await service.findByStudentId(studentId);
    if (promotions.length === 0) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.status(200).json(promotions);
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const promotion = await service.findById(id);
    if (!promotion) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.status(200).json(promotion);
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await service.update(id, req.body);
    res.status(200).json(updated);
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    await service.delete(id);
    res.status(204).send();
  }
}