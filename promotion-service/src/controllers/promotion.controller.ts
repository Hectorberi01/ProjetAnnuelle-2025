import { Request, Response } from 'express';
import { PromotionSchema } from '../validation/validation';
import { PromotionService } from '../services/promotion.service';
import { AppDataSource } from '../config/database'; // Make sure path is correct

const service = new PromotionService(AppDataSource);

export class PromotionController {
 
    
    // Remove "async" before the assignment - this is a syntax error
    static async createPromotion(req: Request, res: Response) {
        try {
            const data = PromotionSchema.parse(req.body);
            const promo = await service.create(data);
            res.status(201).json(promo);
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    }
    
    // Remove "async" before the assignment - this is a syntax error
    static async getPromotions(_: Request, res: Response) {
        const promos = await service.findAll();
        res.json(promos);
    }
    
    // Renamed from getPromotion to getPromotionById for clarity
    static async getPromotionById(req: Request, res: Response) : Promise<any> {
        const promo = await service.findOne(req.params.id);
        if (!promo) return res.status(404).json({ error: 'Non trouvé' });
        res.json(promo);
    }
    
    
    // Remove "async" before the assignment - this is a syntax error
    static async deletePromotion(req: Request, res: Response) {
        await service.delete(req.params.id);
        res.status(204).send();
    }
}