import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Deliverable } from '../entities/Deliverable';
import { ValidationRule } from '../entities/ValidationRule';
import { SimilarityComparison } from '../entities/SimilarityComparison';


// Spécifiez le chemin vers le fichier .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.LIVRABLE_DB_NAME || 'Livrable_Service',
  synchronize: true,
  logging: false,
  entities: [Deliverable, ValidationRule, SimilarityComparison],
  migrations: [],
  subscribers: [],
});
