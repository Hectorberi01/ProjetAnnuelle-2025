import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Project } from '../entities/Project';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'projet-Service',
  synchronize: true,
  logging: false,
  entities: [Project],
  migrations: [],
  subscribers: [],
});