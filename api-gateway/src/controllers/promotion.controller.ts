import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GatewayPromotionService } from "../services/promotion/gateway.promotion.service";

@Controller('promotions')
export class PromotionController {
    constructor(private readonly promotionService: GatewayPromotionService) {}
    // GET all promotions
    @Get('/all')
    public async getAllPromotions() {
        return await this.promotionService.getAllPromotions();
    }
    // Create a new promotion
    @Post('/create')
    public async createPromotion(@Body() promotion: any){
        return this.promotionService.createPromotion(promotion);
    }
    // GET a promotion by ID
    @Get('/:id/get')
    public async getPromotionById(@Param('id')  id: string): Promise<any> {
        return this.promotionService.getPromotionById(parseInt(id, 10));
    }
    // Update a promotion
    @Put(':id/update')
    public async updatePromotion(@Param('id') id: string, @Body()promotion: any): Promise<any> {
        return this.promotionService.updatePromotion(parseInt(id, 10), promotion);
    }
    // Delete a promotion
    @Delete('/:id/delete')
    public async deletePromotion(@Param('id') id: string): Promise<void> {
        return this.promotionService.deletePromotion(parseInt(id, 10));
    }

}