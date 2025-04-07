import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Deliverable } from '../entities/Deliverable';
import { Submission } from '../entities/Submission';
import { ValidationRule } from '../entities/ValidationRule';


// Spécifiez le chemin vers le fichier .env
dotenv.config({ path: '../../src/.env' });

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'livrableService',
  synchronize: true,
  logging: false,
  entities: [Deliverable, Submission, ValidationRule],
  migrations: [],
  subscribers: [],
});
