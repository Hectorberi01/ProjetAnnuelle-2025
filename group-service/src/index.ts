import express from "express";
import { AppDataSource } from "./config/database";
import cors from 'cors';
import group from "./routes/group.routes";


const app  = express()

const PORT = process.env.GROUP_PORT || 3004

const main = async () => {

    try {
        await AppDataSource.initialize();
        console.log('Database connection established');

        // 2. Middleware
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // 3. Routes
        app.use("/groups", group);

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
    process.exit(1);
}
)