import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { CommentaireGlobal } from '../entities/CommentaireGlobal';
import { CritereNotation } from '../entities/CritereNotation';
import { GrilleNotation } from '../entities/GrilleNotation';
import { NotationFinalisee } from '../entities/NotationFinalisee';
import { NoteGroupe } from '../entities/NoteGroupe';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'Notation-Service',
  synchronize: true,
  logging: false,
entities: [GrilleNotation,
    CritereNotation,
    NoteGroupe,
    CommentaireGlobal,
    NotationFinalisee],
  migrations: [],
  subscribers: [],
});


