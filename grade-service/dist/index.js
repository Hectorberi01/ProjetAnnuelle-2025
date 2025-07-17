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
const database_1 = require("./config/database");
const cors_1 = __importDefault(require("cors"));
const grades_1 = __importDefault(require("./routes/grades"));
const grids_1 = __importDefault(require("./routes/grids"));
const app = (0, express_1.default)();
const PORT = process.env.GRADE_PORT || 3005;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.AppDataSource.initialize();
        console.log('Database connection established');
        // 2. Middleware
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        // 3. Routes
        app.use("/api", grids_1.default);
        app.use("/api", grades_1.default);
        // 5. Lancement serveur
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Error establishing database connection:', error);
        //process.exit(1);
    }
});
main()
    .catch((err) => {
    console.error('Error starting the server:', err);
    process.exit(1);
});
