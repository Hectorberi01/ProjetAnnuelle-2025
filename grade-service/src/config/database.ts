import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Grade } from '../entities/Grade';
import { GradeCriterion } from '../entities/GradeCriterion';
import { GradeComment } from '../entities/GradeComment';
import { GradeGrid } from '../entities/GradeGrid';


// Spécifiez le chemin vers le fichier .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME  || 'hector',
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME || 'grade-Service',
  synchronize: true,
  logging: false,
  entities: [Grade,GradeCriterion, GradeComment, GradeGrid],
  migrations: [],
  subscribers: [],
});
