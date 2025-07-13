import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Soutenance } from '../entities/Soutenance';


// Spécifiez le chemin vers le fichier .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.SOUTENANCE_DB_NAME || 'Soutenance_Service',
  synchronize: true,
  logging: false,
  entities: [Soutenance],
  migrations: [],
  subscribers: [],
});
