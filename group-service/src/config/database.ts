import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Group } from '../entities/Group';
//import { GroupConfig } from '../entities/GroupConfig';
import { GroupStudent } from '../entities/groupeStudent';


// Spécifiez le chemin vers le fichier .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME  || 'hector',
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME || 'group-Service',
  synchronize: true,
  logging: false,
  entities: [Group,GroupStudent],
  migrations: [],
  subscribers: [],
});