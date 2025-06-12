import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Soutenance } from '../entities/Soutenance';


// Spécifiez le chemin vers le fichier .env
dotenv.config();

console.log('Database configuration:', {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'soutenance-Service',
  synchronize: true,
  logging: false,
  entities: [Soutenance],
  migrations: [],
  subscribers: [],
});
