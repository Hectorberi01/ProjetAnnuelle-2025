import express from 'express';
import cors from 'cors';
import gradingRoutes from './routes/gradingRoutes';
import { AppDataSource } from './config/database';


const app = express();
const PORT = process.env.PORT || 3005;



const main = async () => {

    try {
        await AppDataSource.initialize();
        console.log('Database connection established');

        // 2. Middleware
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // 3. Routes
         app.use('/notations', gradingRoutes);
          app.get('/health', (req, res) => {
            res.json({ status: 'OK', service: 'notation-service' });
          });
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