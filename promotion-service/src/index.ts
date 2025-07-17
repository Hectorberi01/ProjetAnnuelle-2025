import express from "express";
import { AppDataSource } from "./config/database";
import promotion from "./routes/promotion.route";
import cors from 'cors';



const app  = express()

const PORT = process.env.PROMOTION_PORT || 3007

const main = async () => {

    try {
        await AppDataSource.initialize();
        console.log('Database connection established');

        // 2. Middleware
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // 3. Routes
        app.use('/promotions', promotion);

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
}
)