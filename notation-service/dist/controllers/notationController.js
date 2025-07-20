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
exports.NotationController = void 0;
// Update the path below if NotationService is located elsewhere
const Notationservice_1 = require("../services/Notationservice");
class NotationController {
    constructor() {
        this.getNotation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, groupId } = req.params;
                const notation = yield this.notationService.getNotationGroupe(projectId, groupId);
                res.json(notation);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(500).json({ error: errorMessage });
            }
        });
        this.saveNoteCritere = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, groupId } = req.params;
                const note = yield this.notationService.saveNoteCritere(projectId, groupId, req.body);
                res.json(note);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(400).json({ error: errorMessage });
            }
        });
        this.saveCommentaireGlobal = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, groupId } = req.params;
                const commentaire = yield this.notationService.saveCommentaireGlobal(projectId, groupId, req.body);
                res.json(commentaire);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(400).json({ error: errorMessage });
            }
        });
        this.finalizeNotation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, groupId } = req.params;
                const userId = req.headers['user-id']; // À adapter selon votre système d'auth
                const notation = yield this.notationService.finalizeNotation(projectId, groupId, req.body, userId);
                res.json(notation);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(400).json({ error: errorMessage });
            }
        });
        this.validateSpecificGrille = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, groupId, grilleId } = req.params;
                const result = yield this.notationService.validateSpecificGrille(projectId, groupId, grilleId);
                res.json(result);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(400).json({ error: errorMessage });
            }
        });
        this.publishProjectGrades = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const result = yield this.notationService.publishProjectGrades(projectId);
                res.json(result);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(400).json({ error: errorMessage });
            }
        });
        this.getGradingGridByProjectAndGroup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, groupId } = req.params;
                const result = yield this.notationService.getGradingGridByProjectAndGroup(projectId, groupId);
                res.json(result);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(400).json({ error: errorMessage });
            }
        });
        this.notationService = new Notationservice_1.NotationService();
    }
}
exports.NotationController = NotationController;
