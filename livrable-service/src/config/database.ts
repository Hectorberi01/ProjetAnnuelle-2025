import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Deliverable } from '../entities/Deliverable';
import { Submission } from '../entities/Submission';
import { ValidationRule } from '../entities/ValidationRule';


// Spécifiez le chemin vers le fichier .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'livrable-Service',
  synchronize: true,
  logging: false,
  entities: [Deliverable, Submission, ValidationRule],
  migrations: [],
  subscribers: [],
});
