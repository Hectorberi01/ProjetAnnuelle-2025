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
exports.GradingService = void 0;
const GradingCriteriaRepository_1 = require("../src/repositories/GradingCriteriaRepository");
const GradingGridRepository_1 = require("../src/repositories/GradingGridRepository");
const GradeRepository_1 = require("../src/repositories/GradeRepository");
class GradingService {
    constructor() {
        this.criteriaRepo = new GradingCriteriaRepository_1.GradingCriteriaRepository();
        this.gridRepo = new GradingGridRepository_1.GradingGridRepository();
        this.gradeRepo = new GradeRepository_1.GradeRepository();
    }
    // Gestion des critères
    createCriteria(criteriaData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.criteriaRepo.create(criteriaData);
        });
    }
    getCriteriaByProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.criteriaRepo.findByProjectId(projectId);
        });
    }
    updateCriteria(criteriaId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.criteriaRepo.update(criteriaId, updateData);
        });
    }
    deleteCriteria(criteriaId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.criteriaRepo.delete(criteriaId);
        });
    }
    // Gestion des grilles de notation
    createGradingGrid(gridData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.gridRepo.create(gridData);
        });
    }
    getGradingGrid(projectId, groupId, type, referenceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.gridRepo.findByParams(projectId, groupId, type, referenceId);
        });
    }
    updateGradingGrid(gridId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.gridRepo.update(gridId, updateData);
        });
    }
    validateGradingGrid(gridId, teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.gridRepo.update(gridId, {
                isValidated: true,
                gradedBy: teacherId,
                gradedAt: new Date()
            });
        });
    }
    getProjectGradingGrids(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.gridRepo.findByProjectId(projectId);
        });
    }
    // Calcul des notes finales
    calculateFinalScore(projectId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const grids = yield this.gridRepo.findValidatedByProjectAndGroup(projectId, groupId);
            if (grids.length === 0)
                return 0;
            let totalScore = 0;
            let totalWeight = 0;
            for (const grid of grids) {
                const criteria = yield this.criteriaRepo.findByReference(projectId, grid.referenceId);
                let gridScore = 0;
                let gridWeight = 0;
                for (const criterion of criteria) {
                    const scoreData = grid.criteriaScores.find(s => s.criteriaId === criterion.id);
                    if (scoreData) {
                        gridScore += (scoreData.score / criterion.maxScore) * criterion.weight;
                        gridWeight += criterion.weight;
                    }
                }
                if (gridWeight > 0) {
                    totalScore += gridScore;
                    totalWeight += gridWeight;
                }
            }
            return totalWeight > 0 ? (totalScore / totalWeight) * 20 : 0; // Note sur 20
        });
    }
    // Gestion des notes étudiants
    updateStudentGrade(projectId, studentId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalScore = yield this.calculateFinalScore(projectId, groupId);
            return yield this.gradeRepo.upsert(projectId, studentId, groupId, { finalScore });
        });
    }
    publishGrades(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gradeRepo.publishGradesByProject(projectId);
        });
    }
    getStudentGrades(studentId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.gradeRepo.findPublishedByStudentAndProject(studentId, projectId);
        });
    }
    getProjectGrades(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.gradeRepo.findByProjectId(projectId);
        });
    }
}
exports.GradingService = GradingService;
