import express from "express";
import { AppDataSource } from "./config/database";
import report from "./routes/report.routes";

import cors from 'cors';



const app  = express()

const PORT = process.env.REPORT_PORT || 3006

const main = async () => {

    try {
        await AppDataSource.initialize();

        // 2. Middleware
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // 3. Routes
        app.use('/reports', report);

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