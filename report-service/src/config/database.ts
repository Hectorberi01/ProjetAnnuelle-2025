import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Report } from '../entities/Report.entity';


// Spécifiez le chemin vers le fichier .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'hector',
  password: process.env.DB_PASSWORD ,
  database: process.env.REPORT_DB_NAME || 'Report_Service',
  synchronize: true,
  logging: false,
  entities: [Report],
  migrations: [],
  subscribers: [],
});
