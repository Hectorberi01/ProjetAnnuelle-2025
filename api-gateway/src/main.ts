import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from "cors"
import * as dotenv from 'dotenv';
dotenv.config();

console.log('✅ .env loaded, PROJETS =', process.env.PROJETS);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  await app.listen(3000);
}
bootstrap();
