import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import { AppDataSource } from "./database/database";
import { initRoutes } from "./routes/initRoutes";
dotenv.config();

const app = express();
// Port
const PORT = process.env.PORT || 3003;

const main = async () => {
  try {
    // Initialiser la connexion à la base de données
    await AppDataSource.initialize();
    console.log("📦 Base de données connectée !");
    app.use(express.json());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    initRoutes(app);


    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Erreur de connexion à la base :", error);
  }
};
main()
  .catch((err) => {
    console.error("❌ Erreur lors du démarrage de l'application :", err);
  })
  .finally(() => {
    console.log("🚀 Application démarrée !");
  }
  );



