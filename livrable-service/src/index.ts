import express from "express";
import { AppDataSource } from "./config/database";
import deliverableRoutes from "./routes/deliverable.routes";
import cron from 'node-cron';
import {DeliverableService} from "./services/deliverable.service";
//import { checkSimilarityOnDeadline } from './scripts/checkSimilarityOnDeadline';
//import submissionRoutes from "./routes/submission.routes";

const deliverableService = new DeliverableService();
const app  = express()

const PORT = process.env.PORT || 3009

const main = async () => {
  

   

    try {
        await AppDataSource.initialize();
        console.log('Database connection established');

        deliverableService.startSimilarityCron();

        // 2. Middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // 3. Routes
        app.use('/deliverables', deliverableRoutes);
        //app.use('/api/submissions', submissionRoutes);
        // app.use('/api/rules', rulesRoutes);

        // 4. Cron job to check for similarity on deadline
        // cron.schedule('0 0 * * *', async () => {
        //     console.log('⏰ Checking for submissions at deadline...');
        //     await checkSimilarityOnDeadline();
        // });

        //await checkSimilarityOnDeadline();

        // 5. Lancement serveur
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
    catch (error) {
        console.error('Error establishing database connection:', error);
        process.exit(1);
    }  
}

main()
.catch((err) => {
    console.error('Error starting the server:', err);
    process.exit(1);
}
)