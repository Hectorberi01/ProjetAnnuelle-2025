import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ReportSection } from '../entities/ReportSection.entity';
import { Report } from '../entities/Report.entity';


// Spécifiez le chemin vers le fichier .env
dotenv.config({ path: '../../src/.env' });

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'reportService',
  synchronize: true,
  logging: false,
  entities: [ReportSection, Report],
  migrations: [],
  subscribers: [],
});
