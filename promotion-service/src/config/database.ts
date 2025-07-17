import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Promotion } from '../entities/Promotion';
import { PromotionStudent } from '../entities/PromotionStudent';


// Spécifiez le chemin vers le fichier .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'hector',
  password: process.env.DB_PASSWORD || 'hector',
  database: process.env.PROMOTION_DB_NAME || 'Promotion_Service',
  synchronize: true,
  logging: false,
  entities: [Promotion,PromotionStudent],
  migrations: [],
  subscribers: [],
});
