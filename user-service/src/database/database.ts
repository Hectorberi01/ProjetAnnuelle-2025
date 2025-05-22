import { DataSource } from "typeorm";
import * as dotenv from 'dotenv'
import { User } from "./entities/User";
import { Role } from "./entities/Role";

dotenv.config();
// Créer une instance de DataSource
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "user-Service",
    logging: false, 
    synchronize: true,
    entities: [User,Role],
})