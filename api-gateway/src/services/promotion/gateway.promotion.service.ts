import { HttpService } from "@nestjs/axios";
import { SERVICES } from "../../config/services.config";
import { GatewayProjectService } from "../projets/gateway.project.service";

export class GatewayPromotionService {
    public constructor(
        private readonly httpService: HttpService,
    ) {}

    private readonly gatewayProjectService = new GatewayProjectService(this.httpService);

    // Create a new promotion
    public async createPromotion(promotion: any): Promise<any> {
        try {
            const response = await fetch(`${SERVICES.promotions}`, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(promotion),
            });
    
            if (!response.ok) {
                throw new Error("Failed to create promotion");
            }
            return await response.json();
        }catch (error) {
            throw new Error("Failed to create promotion");
        }
    }
    // GET all promotions
    public async getAllPromotions() {
        try {
            const response = await fetch((`${SERVICES.promotions}`));
            if (!response) {
            throw new Error("Failed to fetch promotions dans le service");
            }
            return await response.json();
        }catch (error) {
            throw new Error("Failed to fetch promotions");
        }
    }

    // GET a promotion by ID
    public async getPromotionById(promotionId: number){
        try {
            const response = await fetch(`${SERVICES.promotions}/${promotionId}`);
            if (!response) {
                throw new Error("Failed to fetch promotion");
            }

            return await response.json();
        }catch (error) {
        throw new Error("Failed to fetch promotion, promotionId: " + promotionId);
        }
    }
    // Update a promotion
    public async updatePromotion(promotionId: number, promotion: any){
        try {
            const response = await fetch(`${SERVICES.promotions}/${promotionId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(promotion),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update promotion");
            }
            return await response.json();
        }catch (error) {
            throw new Error("Failed to update promotion");
        }
    }
    // Delete a promotion
    public async deletePromotion(promotionId: number){
        try {
            const response = await fetch(`${SERVICES.promotions}/${promotionId}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json",},
            });
    
            if (!response.ok) {
                throw new Error("Failed to delete promotion");
            }
        }catch (error) {
            throw new Error("Failed to delete promotion");
        }
    }
}