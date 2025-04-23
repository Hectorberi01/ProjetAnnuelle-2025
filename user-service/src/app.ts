import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import { AppDataSource } from "./database/database";
import { initRoutes } from "./routes/initRoutes";

// Charger les variables d'environnement
dotenv.config();

// Init express
const app = express();
app.use(express.json());

// Connexion à la base de données
AppDataSource.initialize()
  .then(() => {
    console.log("📦 Base de données connectée !");
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à la base :", err);
    process.exit(1);
  });

// Initialiser les routes
initRoutes(app);

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
