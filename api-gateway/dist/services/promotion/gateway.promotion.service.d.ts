import { HttpService } from "@nestjs/axios";
export declare class GatewayPromotionService {
    private readonly httpService;
    constructor(httpService: HttpService);
    createPromotion(promotion: any): Promise<any>;
    getAllPromotions(): Promise<any>;
    getPromotionById(promotionId: number): Promise<any>;
    updatePromotion(promotionId: number, promotion: any): Promise<any>;
    deletePromotion(promotionId: number): Promise<void>;
}
