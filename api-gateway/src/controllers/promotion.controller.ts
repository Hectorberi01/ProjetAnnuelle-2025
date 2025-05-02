import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, Req } from "@nestjs/common";
import { GatewayPromotionService } from "../services/promotion/gateway.promotion.service";
import { CreatePromotion, Promotion } from "src/types/types";
import { FileInterceptor } from "@nestjs/platform-express";

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
    @UseInterceptors(FileInterceptor('file'))
    public async createPromotion(@UploadedFile() file : Express.Multer.File, @Body("promotion") promotion: string){
        const promotionData = JSON.parse(promotion);
        return this.promotionService.createPromotion(promotionData, file);
    }

    // Add a student to a promotion
    @Post('/:id/addStudent')
    public async addStudentToPromotion(@Param('id') id: string, @Body() student: any): Promise<any> {
        return this.promotionService.addStudentToPromotion(parseInt(id, 10), student);
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