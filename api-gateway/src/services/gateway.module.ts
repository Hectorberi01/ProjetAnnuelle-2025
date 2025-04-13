import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProjectController } from 'src/contollers/project.controller';
import { GatewayProjectService } from './gateway.project.service';

@Module({
    imports: [HttpModule],
    controllers: [ProjectController],
    providers: [GatewayProjectService],
})
export class GatewayModule {}