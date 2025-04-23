import { GatewayPromotionService } from "../services/promotion/gateway.promotion.service";
export declare class PromotionController {
    private readonly promotionService;
    constructor(promotionService: GatewayPromotionService);
    getAllPromotions(): Promise<any>;
    createPromotion(promotion: any): Promise<any>;
    getPromotionById(id: string): Promise<any>;
    updatePromotion(id: string, promotion: any): Promise<any>;
    deletePromotion(id: string): Promise<void>;
}
