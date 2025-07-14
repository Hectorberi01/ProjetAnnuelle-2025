import express from 'express';
import cors from 'cors';
import gradingRoutes from './routes/gradingRoutes';
import { AppDataSource } from './config/database';


const app = express();
const PORT = process.env.NOTATIONS_PORT || 3005;

const main = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Middlewares
    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ✅ Ajoute cette ligne pour activer les routes de notation :
    app.use('/grading', gradingRoutes);



    app.get('/health', (req, res) => {
      res.json({ status: 'OK', service: 'notation-service' });
    });
    // Lancer le serveur
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    app.use((req, res) => {
       res.status(404).json({ error: "Endpoint not found" });
    });
  } catch (error) {
    console.error('Error establishing database connection:', error);
  }




  
};

main().catch((err) => {
  console.error('Error starting the server:', err);
});
