import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Notation } from '../entities/Notation';
import { Criterion } from '../entities/Critere';


// Spécifiez le chemin vers le fichier .env
dotenv.config();
console.log("Nom de la base chargée depuis .env:", process.env.DB_NAME);

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'notation_db',
  synchronize: true,
  logging: false,
  entities: [Notation, Criterion  ],
  migrations: [],
  subscribers: [],
});
