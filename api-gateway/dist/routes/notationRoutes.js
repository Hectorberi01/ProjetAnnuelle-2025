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
const express_1 = require("express");
const notationService_1 = require("../services/notationService");
const router = (0, express_1.Router)();
// --- GRILLES DE NOTATION (avec critères) ---
router.get('/:projectId/grilles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, notationService_1.getGradingCriteria)(req.params.projectId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des grilles.' });
    }
}));
router.post('/:projectId/grilles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, notationService_1.addGradingCriteria)(req.params.projectId, req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la grille.' });
    }
}));
router.put('/grilles/:grilleId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, notationService_1.updateGradingCriteria)(req.params.grilleId, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la grille.' });
    }
}));
router.get('/:projectId/groups/:groupId/grilles/criteres', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, notationService_1.getGrillesCritere)(req.params.projectId, req.params.groupId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des critères de grille.' });
    }
}));
router.post('/:projectId/groups/:groupId/criteres', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, notationService_1.createGrille)(req.params.projectId, req.params.groupId, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la grille.' });
    }
}));
router.delete('/grilles/:grilleId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, notationService_1.deleteGradingCriteria)(req.params.grilleId);
        res.status(200).json({ message: 'Grille supprimée avec succès.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la grille.' });
    }
}));
router.post('/:projectId/grilles/:grilleId/validate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, notationService_1.validateGradingGrid)(req.params.grilleId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la validation de la grille.' });
    }
}));
// --- NOTATION GROUPE ---
router.get('/:projectId/groups/:groupId/notation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, notationService_1.getGradingGridByProjectAndGroup)(req.params.projectId, req.params.groupId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la notation.' });
    }
}));
router.post('/:projectId/groups/:groupId/notation/critere', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, notationService_1.saveCritereNote)(req.params.projectId, req.params.groupId, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la sauvegarde de la note de critère.' });
    }
}));
router.post('/:projectId/groups/:groupId/notation/commentaire-global', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, notationService_1.saveGlobalComment)(req.params.projectId, req.params.groupId, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement du commentaire global.' });
    }
}));
router.post('/:projectId/groups/:groupId/notation/finalize', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId; // À extraire proprement du token plus tard
        const result = yield (0, notationService_1.finalizeGroupNotation)(req.params.projectId, req.params.groupId, req.body, userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la finalisation de la notation.' });
    }
}));
router.post('/:projectId/groups/:groupId/notation/grilles/:grilleId/validate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, notationService_1.validateSpecificGrille)(req.params.projectId, req.params.groupId, req.params.grilleId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la validation de la grille.' });
    }
}));
// Publier les notes d'un projet (les rendre visibles aux étudiants)
router.post('/:projectId/publish', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, notationService_1.publishProjectGrades)(req.params.projectId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la publication des notes.' });
    }
}));
exports.default = router;
