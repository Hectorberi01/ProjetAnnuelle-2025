import { HttpModule } from "@nestjs/axios";
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//import { GatewayModule } from './gateway/gateway.module';
import { GatewayModule } from "./services/gateway.module";


@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot({ isGlobal: true }),
        GatewayModule,
    ],
  })
  export class AppModule {}