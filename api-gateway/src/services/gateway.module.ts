import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GatewayProjectService } from './projets/gateway.project.service';
import { ProjectController } from '../controllers/project.controller';
import { PromotionController } from '../controllers/promotion.controller';
import { GatewayPromotionService } from './promotion/gateway.promotion.service';

@Module({
    imports: [HttpModule],
    controllers: [ProjectController, PromotionController],
    providers: [GatewayProjectService, GatewayPromotionService]
})
export class GatewayModule {}