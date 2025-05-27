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
const deliverable_routes_1 = __importDefault(require("./routes/deliverable.routes"));
const deliverable_service_1 = require("./services/deliverable.service");
//import { checkSimilarityOnDeadline } from './scripts/checkSimilarityOnDeadline';
//import submissionRoutes from "./routes/submission.routes";
const deliverableService = new deliverable_service_1.DeliverableService();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3009;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.AppDataSource.initialize();
        console.log('Database connection established');
        deliverableService.startSimilarityCron();
        // 2. Middleware
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        // 3. Routes
        app.use('/deliverables', deliverable_routes_1.default);
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
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Error establishing database connection:', error);
        process.exit(1);
    }
});
main()
    .catch((err) => {
    console.error('Error starting the server:', err);
    process.exit(1);
});
