"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const database_1 = require("./database/database");
const initRoutes_1 = require("./routes/initRoutes");
// Charger les variables d'environnement
dotenv_1.default.config();
// Init express
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Connexion à la base de données
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("📦 Base de données connectée !");
})
    .catch((error) => {
    console.error("❌ Erreur de connexion à la base :", error);
    process.exit(1);
});
// Initialiser les routes
(0, initRoutes_1.initRoutes)(app);
// Port
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
