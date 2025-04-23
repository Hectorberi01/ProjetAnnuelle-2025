"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionController = void 0;
const common_1 = require("@nestjs/common");
const gateway_promotion_service_1 = require("../services/promotion/gateway.promotion.service");
let PromotionController = class PromotionController {
    constructor(promotionService) {
        this.promotionService = promotionService;
    }
    async getAllPromotions() {
        return await this.promotionService.getAllPromotions();
    }
    async createPromotion(promotion) {
        return this.promotionService.createPromotion(promotion);
    }
    async getPromotionById(id) {
        return this.promotionService.getPromotionById(parseInt(id, 10));
    }
    async updatePromotion(id, promotion) {
        return this.promotionService.updatePromotion(parseInt(id, 10), promotion);
    }
    async deletePromotion(id) {
        return this.promotionService.deletePromotion(parseInt(id, 10));
    }
};
exports.PromotionController = PromotionController;
__decorate([
    (0, common_1.Get)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "getAllPromotions", null);
__decorate([
    (0, common_1.Post)('/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "createPromotion", null);
__decorate([
    (0, common_1.Get)('/:id/get'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "getPromotionById", null);
__decorate([
    (0, common_1.Put)(':id/update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "updatePromotion", null);
__decorate([
    (0, common_1.Delete)('/:id/delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "deletePromotion", null);
exports.PromotionController = PromotionController = __decorate([
    (0, common_1.Controller)('promotions'),
    __metadata("design:paramtypes", [gateway_promotion_service_1.GatewayPromotionService])
], PromotionController);
//# sourceMappingURL=promotion.controller.js.map