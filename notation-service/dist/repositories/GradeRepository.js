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
exports.GradeRepository = void 0;
const database_1 = require("../config/database");
const Grade_1 = require("../entities/Grade");
class GradeRepository {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(Grade_1.Grade);
    }
    create(gradeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const grade = this.repository.create(gradeData);
            return yield this.repository.save(grade);
        });
    }
    findByStudentAndProject(studentId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findOne({
                where: { studentId, projectId }
            });
        });
    }
    findByProjectId(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find({
                where: { projectId },
                order: { finalScore: 'DESC' }
            });
        });
    }
    findPublishedByStudentAndProject(studentId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findOne({
                where: { studentId, projectId, isPublished: true }
            });
        });
    }
    upsert(projectId, studentId, groupId, gradeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingGrade = yield this.repository.findOne({
                where: { projectId, studentId, groupId }
            });
            if (existingGrade) {
                yield this.repository.update(existingGrade.id, gradeData);
                const updatedGrade = yield this.repository.findOne({ where: { id: existingGrade.id } });
                if (!updatedGrade) {
                    throw new Error('Grade not found after update');
                }
                return updatedGrade;
            }
            else {
                const newGrade = this.repository.create(Object.assign({ projectId,
                    studentId,
                    groupId }, gradeData));
                return yield this.repository.save(newGrade);
            }
        });
    }
    publishGradesByProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update({ projectId }, { isPublished: true });
        });
    }
}
exports.GradeRepository = GradeRepository;
