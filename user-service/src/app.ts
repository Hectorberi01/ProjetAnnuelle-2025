import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import { AppDataSource } from "./database/database";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import roleRoutes from "./routes/role.routes";
dotenv.config();

const app = express();
const PORT = process.env.USER_PORT || 3003;

const main = async () => {

    try {
        await AppDataSource.initialize();
        console.log('Database connection established');

        // 2. Middleware
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // 3. Routes
        app.use('/users',userRoutes);
        app.use('/roles', roleRoutes);

        // 5. Lancement serveur
        app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`)
        })
    }
    catch (error) {
      console.error('Error establishing database connection:', error);
    }  
}

main()
.catch((err) => {
    console.error('Error starting the server:', err);
}
)



