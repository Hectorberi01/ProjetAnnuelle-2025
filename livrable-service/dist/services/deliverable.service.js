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
exports.DeliverableService = void 0;
const database_1 = require("../config/database");
const Deliverable_1 = require("../entities/Deliverable");
const ValidationRule_1 = require("../entities/ValidationRule");
const deliverableRepo = database_1.AppDataSource.getRepository(Deliverable_1.Deliverable);
const ruleRepo = database_1.AppDataSource.getRepository(ValidationRule_1.ValidationRule);
class DeliverableService {
    constructor() {
        // Fonction pour créer un livrable
        this.createDeliverable = (data) => __awaiter(this, void 0, void 0, function* () {
            const { name, description, deadline, allowLate, latePenaltyPerHour, projectId, rules } = data;
            const deliverable = deliverableRepo.create({ name, description, deadline, allowLate, latePenaltyPerHour, projectId: projectId });
            // Créer un nouveau livrable
            const savedDeliverable = yield deliverableRepo.save(deliverable);
            if (Array.isArray(rules)) {
                for (const rule of rules) {
                    const newRule = ruleRepo.create(Object.assign(Object.assign({}, rule), { deliverable: savedDeliverable }));
                    yield ruleRepo.save(newRule);
                }
            }
            return savedDeliverable;
        });
    }
    // Récupérer tous les livrables d'un projet spécifique
    getProjectDeliverables(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield deliverableRepo.find({ where: { projectId }, relations: ['rules', 'submissions'], });
        });
    }
    // Fonction pour récupérer tous les livrables
    getAllDeliverables() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield deliverableRepo.find({ relations: ['rules', 'submissions'] });
        });
    }
    // Fonction pour récupérer un livrable par son ID
    getDeliverableById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield deliverableRepo.findOne({ where: { id }, relations: ['rules', 'submissions'] });
        });
    }
    // Fonction pour mettre à jour un livrable
    updateDeliverable(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const deliverable = yield deliverableRepo.findOne({ where: { id } });
            if (!deliverable) {
                throw new Error('Deliverable not found');
            }
            Object.assign(deliverable, data); // Mettre à jour les propriétés du livrable
            return yield deliverableRepo.save(deliverable); // Enregistrer les modifications
        });
    }
    // Fonction pour supprimer un livrable
    deleteDeliverable(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deliverable = yield deliverableRepo.findOne({ where: { id } });
            if (!deliverable) {
                return null;
            }
            return yield deliverableRepo.remove(deliverable);
        });
    }
    // Get all rules deliverables by specific deliverable ID
    getDeliverablesById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deliverable = yield deliverableRepo.findOne({ where: { id }, relations: ['rules'] });
            // Check if the deliverable exists
            if (!(deliverable === null || deliverable === void 0 ? void 0 : deliverable.rules))
                return null;
            return deliverable === null || deliverable === void 0 ? void 0 : deliverable.rules;
        });
    }
    /** Création, modification, mise à jour et suppression d'une règles */
    // Fonction pour récupérer les règles de validation d'un livrable
    createValidationRule(data, deliverableId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, value } = data;
            const deliverable = yield deliverableRepo.findOne({ where: { id: deliverableId } });
            if (!deliverable) {
                return null;
            }
            const rule = ruleRepo.create({ type, value, deliverable });
            return yield ruleRepo.save(rule);
        });
    }
    // Fonction pour mettre à jour une règle de validation
    updateValidationRule(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const rule = yield ruleRepo.findOne({ where: { id } });
            if (!rule) {
                return null;
            }
            Object.assign(rule, data);
            return yield ruleRepo.save(rule);
        });
    }
    // Fonction pour supprimer une règle de validation
    deleteValidationRule(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rule = yield ruleRepo.findOne({ where: { id } });
            if (!rule) {
                return null;
            }
            return yield ruleRepo.remove(rule);
        });
    }
    // Fonction pour récupérer une règle de validation par son ID
    getValidationRuleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ruleRepo.findOne({ where: { id } });
        });
    }
}
exports.DeliverableService = DeliverableService;
