import express from "express";
import { AppDataSource } from "./config/database";
import cors from 'cors';
import grades from "./routes/grades";
import grids from "./routes/grids";



const app  = express()

const PORT = process.env.GRADE_PORT || 3005;

const main = async () => {

    try {
        await AppDataSource.initialize();
        console.log('Database connection established');

        // 2. Middleware
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // 3. Routes
        app.use("/api", grids);
        app.use("/api", grades);


        // 5. Lancement serveur
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
    catch (error) {
        console.error('Error establishing database connection:', error);
        //process.exit(1);
    }  
}

main()
.catch((err) => {
    console.error('Error starting the server:', err);
    process.exit(1);
}
)