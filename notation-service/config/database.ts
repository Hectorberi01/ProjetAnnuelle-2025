import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Grade } from '../entities/Grade';

import {  GradingGrid } from '../entities/GradingGrid';
import {  GradingCriteria } from '../entities/GradingCriteria';
dotenv.config();

// export const AppDataSource = new DataSource({
//   type: 'mysql',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT || '3306'),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME || 'livrable-Service',
//   synchronize: true,
//   logging: false,
//   entities: [
//     GradingSheet,
//     Criterion,
//     GradeSet,
//     CriterionGrade
//   ],
//   migrations: [],
//   subscribers: [],
// });
const isCompiled = __filename.endsWith('.js');


export const AppDataSource = new DataSource({
  type: 'postgres', // ⚠️ Changé de 'mysql' à 'postgres'
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'), // Port par défaut PostgreSQL
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'grading_db', // Doit matcher docker-compose
  synchronize: true, // À désactiver en production
  logging: true, // Activer pour le débogage
entities: [GradingCriteria, GradingGrid, Grade],
  migrations: [],
  subscribers: [],
  
});