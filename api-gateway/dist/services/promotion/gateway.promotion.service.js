"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayPromotionService = void 0;
const services_config_1 = require("../../config/services.config");
const gateway_project_service_1 = require("../projets/gateway.project.service");
class GatewayPromotionService {
    constructor(httpService) {
        this.httpService = httpService;
        this.gatewayProjectService = new gateway_project_service_1.GatewayProjectService(this.httpService);
    }
    async createPromotion(promotion) {
        try {
            const response = await fetch(`${services_config_1.SERVICES.promotions}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(promotion),
            });
            if (!response.ok) {
                throw new Error("Failed to create promotion");
            }
            return await response.json();
        }
        catch (error) {
            throw new Error("Failed to create promotion");
        }
    }
    async getAllPromotions() {
        try {
            const response = await fetch((`${services_config_1.SERVICES.promotions}`));
            if (!response) {
                throw new Error("Failed to fetch promotions dans le service");
            }
            return await response.json();
        }
        catch (error) {
            throw new Error("Failed to fetch promotions");
        }
    }
    async getPromotionById(promotionId) {
        try {
            const response = await fetch(`${services_config_1.SERVICES.promotions}/${promotionId}`);
            if (!response) {
                throw new Error("Failed to fetch promotion");
            }
            return await response.json();
        }
        catch (error) {
            throw new Error("Failed to fetch promotion, promotionId: " + promotionId);
        }
    }
    async updatePromotion(promotionId, promotion) {
        try {
            const response = await fetch(`${services_config_1.SERVICES.promotions}/${promotionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(promotion),
            });
            if (!response.ok) {
                throw new Error("Failed to update promotion");
            }
            return await response.json();
        }
        catch (error) {
            throw new Error("Failed to update promotion");
        }
    }
    async deletePromotion(promotionId) {
        try {
            const response = await fetch(`${services_config_1.SERVICES.promotions}/${promotionId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", },
            });
            if (!response.ok) {
                throw new Error("Failed to delete promotion");
            }
        }
        catch (error) {
            throw new Error("Failed to delete promotion");
        }
    }
}
exports.GatewayPromotionService = GatewayPromotionService;
//# sourceMappingURL=gateway.promotion.service.js.map