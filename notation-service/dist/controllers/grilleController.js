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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrilleController = void 0;
const GrilleService_1 = require("../services/GrilleService");
class GrilleController {
    constructor() {
        this.getGrilles = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const grilles = yield this.grilleService.getGrillesByProject(projectId);
                res.json(grilles);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(500).json({ error: errorMessage });
            }
        });
        this.getGrillesCritere = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { grilleId } = req.params;
                const critere = yield this.grilleService.getCriteresByGrille(grilleId);
                res.json(critere);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(500).json({ error: errorMessage });
            }
        });
        this.createGrille = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const grille = yield this.grilleService.createGrille(projectId, req.body);
                res.status(201).json(grille);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(400).json({ error: errorMessage });
            }
        });
        this.createCritere = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, groupId } = req.params;
                const critere = yield this.grilleService.createCritere(projectId, groupId, req.body);
                res.status(201).json(critere);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(400).json({ error: errorMessage });
            }
        });
        this.updateGrille = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { grilleId } = req.params;
                const grille = yield this.grilleService.updateGrille(grilleId, req.body);
                res.json(grille);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(400).json({ error: errorMessage });
            }
        });
        this.deleteGrille = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { grilleId } = req.params;
                yield this.grilleService.deleteGrille(grilleId);
                res.status(204).send();
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(400).json({ error: errorMessage });
            }
        });
        this.validateGrille = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { grilleId } = req.params;
                const grille = yield this.grilleService.validateGrille(grilleId);
                res.json(grille);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(400).json({ error: errorMessage });
            }
        });
        this.grilleService = new GrilleService_1.GrilleService();
    }
}
exports.GrilleController = GrilleController;
