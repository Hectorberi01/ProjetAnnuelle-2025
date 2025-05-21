import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ReportSection } from '../entities/ReportSection.entity';
import { Report } from '../entities/Report.entity';


// Spécifiez le chemin vers le fichier .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'hector',
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME || 'report-Service',
  synchronize: true,
  logging: false,
  entities: [Report],
  migrations: [],
  subscribers: [],
});
