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
exports.GradingCriteriaRepository = void 0;
const database_1 = require("../config/database");
const GradingCriteria_1 = require("../entities/GradingCriteria");
class GradingCriteriaRepository {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(GradingCriteria_1.GradingCriteria);
    }
    create(criteriaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const criteria = this.repository.create(criteriaData);
            return yield this.repository.save(criteria);
        });
    }
    findByProjectId(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find({
                where: { projectId },
                order: { createdAt: 'ASC' }
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findOne({ where: { id } });
        });
    }
    update(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update(id, updateData);
            return yield this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.delete(id);
            return result.affected > 0;
        });
    }
    findByReference(projectId, referenceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find({
                where: [
                    { projectId, deliverableId: referenceId },
                    { projectId, reportId: referenceId },
                    { projectId, presentationId: referenceId }
                ]
            });
        });
    }
}
exports.GradingCriteriaRepository = GradingCriteriaRepository;
