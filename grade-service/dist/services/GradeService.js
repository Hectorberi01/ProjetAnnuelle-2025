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
exports.GradeService = void 0;
// services/GradeService.ts
const database_1 = require("../config/database");
const Grade_1 = require("../entities/Grade");
const GradeCriterion_1 = require("../entities/GradeCriterion");
const GradeComment_1 = require("../entities/GradeComment");
class GradeService {
    constructor() {
        this.gradeRepo = database_1.AppDataSource.getRepository(Grade_1.Grade);
        this.commentRepo = database_1.AppDataSource.getRepository(GradeComment_1.GradeComment);
        this.criterionRepo = database_1.AppDataSource.getRepository(GradeCriterion_1.GradeCriterion);
    }
    submitGrades(gridId, groupId, grades) {
        return __awaiter(this, void 0, void 0, function* () {
            const gradeEntities = grades.map(g => this.gradeRepo.create({
                criterion: { id: g.criterionId },
                groupId: groupId,
                score: g.score,
                comment: g.comment
            }));
            return yield this.gradeRepo.save(gradeEntities);
        });
    }
    addGlobalComment(gridId, groupId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = this.commentRepo.create({
                grid: { id: gridId },
                groupId: groupId,
                content
            });
            return yield this.commentRepo.save(comment);
        });
    }
    getGradesForGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.gradeRepo.find({
                where: { groupId: groupId },
                relations: ['criterion', 'criterion.grid']
            });
        });
    }
}
exports.GradeService = GradeService;
