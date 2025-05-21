"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const database_1 = require("./database/database");
const initRoutes_1 = require("./routes/initRoutes");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Port
const PORT = process.env.PORT || 3003;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialiser la connexion à la base de données
        yield database_1.AppDataSource.initialize();
        console.log("📦 Base de données connectée !");
        app.use(express_1.default.json());
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        (0, initRoutes_1.initRoutes)(app);
        app.listen(PORT, () => {
            console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Erreur de connexion à la base :", error);
    }
});
main()
    .catch((err) => {
    console.error("❌ Erreur lors du démarrage de l'application :", err);
})
    .finally(() => {
    console.log("🚀 Application démarrée !");
});
