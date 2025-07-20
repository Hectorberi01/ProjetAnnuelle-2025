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
exports.GrilleService = void 0;
const database_1 = require("../config/database");
const GrilleNotation_1 = require("../entities/GrilleNotation");
const CritereNotation_1 = require("../entities/CritereNotation");
class GrilleService {
    constructor() {
        this.grilleRepository = database_1.AppDataSource.getRepository(GrilleNotation_1.GrilleNotation);
        this.critereRepository = database_1.AppDataSource.getRepository(CritereNotation_1.CritereNotation);
    }
    getGrillesByProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.grilleRepository.find({
                where: { projectId },
                relations: ['criteres'],
                order: { createdAt: 'DESC' }
            });
        });
    }
    createCritere(projectId, groupId, critereData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Vérifier que la grille existe
                const grille = yield this.grilleRepository.findOne({
                    where: { id: critereData.grille_id }
                });
                if (!grille) {
                    throw new Error(`La grille avec l'ID ${critereData.grille_id} n'existe pas`);
                }
                // 2. Validation des données
                if (!critereData.nom || critereData.nom.trim() === '') {
                    throw new Error('Le nom du critère est requis');
                }
                if (critereData.poids === undefined || critereData.poids === null || critereData.poids < 0) {
                    throw new Error('Le poids du critère doit être un nombre positif');
                }
                if (!['groupe', 'individuel'].includes(critereData.typeEvaluation)) {
                    throw new Error('Le type d\'évaluation doit être "groupe" ou "individuel"');
                }
                // 3. Créer le critère
                const critere = new CritereNotation_1.CritereNotation();
                critere.grilleId = critereData.grille_id;
                critere.nom = critereData.nom.trim();
                critere.poids = critereData.poids;
                critere.description = critereData.description || null;
                critere.typeEvaluation = critereData.typeEvaluation;
                // 4. Sauvegarder en base
                const savedCritere = yield this.critereRepository.save(critere);
                return savedCritere;
            }
            catch (error) {
                console.error('Erreur lors de la création du critère:', error);
                throw new Error(error instanceof Error ? error.message : 'Erreur inconnue lors de la création du critère');
            }
        });
    }
    getCriteresByGrille(grilleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const criteres = yield this.critereRepository.find({
                    where: { grilleId: grilleId },
                    order: { id: 'ASC' }
                });
                return criteres;
            }
            catch (error) {
                throw new Error('Erreur lors de la récupération des critères');
            }
        });
    }
    createGrille(projectId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const grille = this.grilleRepository.create({
                projectId,
                titre: data.titre,
                type: data.type,
                ponderationGlobale: data.ponderationGlobale,
                description: data.description
            });
            const savedGrille = yield this.grilleRepository.save(grille);
            if (data.criteres && data.criteres.length > 0) {
                const criteres = data.criteres.map((critere) => this.critereRepository.create({
                    grilleId: savedGrille.id,
                    nom: critere.nom,
                    poids: critere.poids,
                    description: critere.description,
                    typeEvaluation: critere.typeEvaluation || 'groupe'
                }));
                yield this.critereRepository.save(criteres);
            }
            const result = yield this.grilleRepository.findOne({
                where: { id: savedGrille.id },
                relations: ['criteres']
            });
            if (!result) {
                throw new Error('Grille non trouvée après création');
            }
            return result;
        });
    }
    updateGrille(grilleId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const grille = yield this.grilleRepository.findOne({
                where: { id: grilleId },
                relations: ['criteres']
            });
            if (!grille) {
                throw new Error('Grille non trouvée');
            }
            if (grille.validee) {
                throw new Error('Impossible de modifier une grille validée');
            }
            // Mise à jour des propriétés de la grille
            grille.titre = data.titre;
            grille.type = data.type;
            grille.ponderationGlobale = data.ponderationGlobale;
            grille.description = data.description;
            yield this.grilleRepository.save(grille);
            // Supprimer les anciens critères
            yield this.critereRepository.delete({ grilleId });
            // Ajouter les nouveaux critères
            if (data.criteres && data.criteres.length > 0) {
                const criteres = data.criteres.map((critere) => this.critereRepository.create({
                    grilleId: grille.id,
                    nom: critere.nom,
                    poids: critere.poids,
                    description: critere.description,
                    typeEvaluation: critere.typeEvaluation || 'groupe'
                }));
                yield this.critereRepository.save(criteres);
            }
            const updatedGrille = yield this.grilleRepository.findOne({
                where: { id: grilleId },
                relations: ['criteres']
            });
            if (!updatedGrille) {
                throw new Error('Grille non trouvée après mise à jour');
            }
            return updatedGrille;
        });
    }
    deleteGrille(grilleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const grille = yield this.grilleRepository.findOne({ where: { id: grilleId } });
            if (!grille) {
                throw new Error('Grille non trouvée');
            }
            if (grille.validee) {
                throw new Error('Impossible de supprimer une grille validée');
            }
            yield this.grilleRepository.remove(grille);
        });
    }
    validateGrille(grilleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const grille = yield this.grilleRepository.findOne({ where: { id: grilleId } });
            if (!grille) {
                throw new Error('Grille non trouvée');
            }
            grille.validee = true;
            return yield this.grilleRepository.save(grille);
        });
    }
}
exports.GrilleService = GrilleService;
