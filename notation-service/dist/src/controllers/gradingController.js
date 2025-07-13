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
exports.GradingController = void 0;
const gradingService_1 = require("../services/gradingService");
class GradingController {
    constructor() {
        // Critères de notation
        this.createCriteria = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const criteria = yield this.gradingService.createCriteria(req.body);
                res.status(201).json(criteria);
            }
            catch (error) {
                res.status(400).json({ error: 'Erreur lors de la création du critère' });
            }
        });
        this.getCriteriaByProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const criteria = yield this.gradingService.getCriteriaByProject(projectId);
                res.json(criteria);
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur lors de la récupération des critères' });
            }
        });
        this.updateCriteria = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { criteriaId } = req.params;
                const criteria = yield this.gradingService.updateCriteria(criteriaId, req.body);
                if (!criteria) {
                    res.status(404).json({ error: 'Critère non trouvé' });
                    return;
                }
                res.json(criteria);
            }
            catch (error) {
                res.status(400).json({ error: 'Erreur lors de la mise à jour du critère' });
            }
        });
        this.deleteCriteria = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { criteriaId } = req.params;
                const success = yield this.gradingService.deleteCriteria(criteriaId);
                if (!success) {
                    res.status(404).json({ error: 'Critère non trouvé' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur lors de la suppression du critère' });
            }
        });
        // Grilles de notation
        this.createGradingGrid = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const grid = yield this.gradingService.createGradingGrid(req.body);
                res.status(201).json(grid);
            }
            catch (error) {
                res.status(400).json({ error: 'Erreur lors de la création de la grille' });
            }
        });
        this.getGradingGrid = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, groupId, type, referenceId } = req.params;
                const grid = yield this.gradingService.getGradingGrid(projectId, groupId, type, referenceId);
                if (!grid) {
                    res.status(404).json({ error: 'Grille non trouvée' });
                    return;
                }
                res.json(grid);
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur lors de la récupération de la grille' });
            }
        });
        this.updateGradingGrid = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { gridId } = req.params;
                const grid = yield this.gradingService.updateGradingGrid(gridId, req.body);
                if (!grid) {
                    res.status(404).json({ error: 'Grille non trouvée' });
                    return;
                }
                res.json(grid);
            }
            catch (error) {
                res.status(400).json({ error: 'Erreur lors de la mise à jour de la grille' });
            }
        });
        this.validateGradingGrid = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { gridId } = req.params;
                const { teacherId } = req.body;
                const grid = yield this.gradingService.validateGradingGrid(gridId, teacherId);
                if (!grid) {
                    res.status(404).json({ error: 'Grille non trouvée' });
                    return;
                }
                res.json(grid);
            }
            catch (error) {
                res.status(400).json({ error: 'Erreur lors de la validation de la grille' });
            }
        });
        this.getProjectGradingGrids = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const grids = yield this.gradingService.getProjectGradingGrids(projectId);
                res.json(grids);
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur lors de la récupération des grilles' });
            }
        });
        // Notes finales
        this.calculateFinalScore = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, groupId } = req.params;
                const score = yield this.gradingService.calculateFinalScore(projectId, groupId);
                res.json({ finalScore: score });
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur lors du calcul de la note finale' });
            }
        });
        this.publishGrades = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                yield this.gradingService.publishGrades(projectId);
                res.json({ message: 'Notes publiées avec succès' });
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur lors de la publication des notes' });
            }
        });
        this.getStudentGrades = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId, projectId } = req.params;
                const grades = yield this.gradingService.getStudentGrades(studentId, projectId);
                if (!grades) {
                    res.status(404).json({ error: 'Notes non trouvées' });
                    return;
                }
                res.json(grades);
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
            }
        });
        this.getProjectGrades = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const grades = yield this.gradingService.getProjectGrades(projectId);
                res.json(grades);
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur lors de la récupération des notes du projet' });
            }
        });
        this.gradingService = new gradingService_1.GradingService();
    }
}
exports.GradingController = GradingController;
