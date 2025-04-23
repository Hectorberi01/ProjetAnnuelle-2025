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
exports.ValidationRuleService = void 0;
const database_1 = require("../config/database");
const Deliverable_1 = require("../entities/Deliverable");
const ValidationRule_1 = require("../entities/ValidationRule");
const ruleRepo = database_1.AppDataSource.getRepository(ValidationRule_1.ValidationRule);
const deliverableRepo = database_1.AppDataSource.getRepository(Deliverable_1.Deliverable);
class ValidationRuleService {
    constructor() { }
    addRuleToDeliverable(deliverableId, ruleData) {
        return __awaiter(this, void 0, void 0, function* () {
            const deliverable = yield deliverableRepo.findOne({ where: { id: deliverableId } });
            if (!deliverable) {
                throw new Error('Deliverable not found');
            }
            const rule = ruleRepo.create(Object.assign(Object.assign({}, ruleData), { deliverable }));
            return yield ruleRepo.save(rule);
        });
    }
    getRulesByDeliverableId(deliverableId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ruleRepo.find({ where: { deliverable: { id: deliverableId } } });
        });
    }
    updateRule(id, ruleData) {
        return __awaiter(this, void 0, void 0, function* () {
            const rule = yield ruleRepo.findOne({ where: { id } });
            if (!rule) {
                throw new Error('Rule not found');
            }
            Object.assign(rule, ruleData);
            return yield ruleRepo.save(rule);
        });
    }
    deleteRule(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rule = yield ruleRepo.findOne({ where: { id } });
            if (!rule) {
                return null;
            }
            return yield ruleRepo.remove(rule);
        });
    }
    getAllRules() {
        return __awaiter(this, void 0, void 0, function* () { return yield ruleRepo.find(); });
    }
    getRuleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ruleRepo.findOne({ where: { id } });
        });
    }
    getRulesByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ruleRepo.find({ where: { type } });
        });
    }
    getRulesByProjectId(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deliverable = yield deliverableRepo.findOne({ where: { projectId } });
            if (!deliverable) {
                throw new Error('Project not found');
            }
            // Récupérer les livrables associés au projet
            const deliverables = yield deliverableRepo.find({ where: { projectId } });
            const rules = [];
            // Récupérer les règles associées à ces livrables
            for (const deliverable of deliverables) {
                const rules = yield ruleRepo.find({ where: { deliverable: { id: deliverable.id } } });
                rules.push(...rules);
            }
            return rules;
        });
    }
}
exports.ValidationRuleService = ValidationRuleService;
