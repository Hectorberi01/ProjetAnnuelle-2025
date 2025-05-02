import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GatewayProjectService } from './projets/gateway.project.service';
import { ProjectController } from '../controllers/project.controller';
import { PromotionController } from '../controllers/promotion.controller';
import { GatewayPromotionService } from './promotion/gateway.promotion.service';
import { AuthController } from '../controllers/auth.controller';
import { GatewayAuthService } from './auth/gateway.auth.service';
import { UserController } from '../controllers/users.controller';
import { GatewayUsersService } from './user/gateway.users.service';
import { GroupController } from '../controllers/groupe.controllers';
import { GatewayGroupService } from './groupe/gatewaye.groupe.service';

@Module({
    imports: [HttpModule],
    controllers: [ProjectController, PromotionController, AuthController,UserController,GroupController],
    providers: [GatewayProjectService, GatewayPromotionService, GatewayAuthService,GatewayUsersService, GatewayGroupService]
})
export class GatewayModule {}