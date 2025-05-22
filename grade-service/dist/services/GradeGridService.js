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
exports.GradeGridService = void 0;
// services/GradeGridService.ts
const database_1 = require("../config/database");
const GradeGrid_1 = require("../entities/GradeGrid");
const GradeCriterion_1 = require("../entities/GradeCriterion");
class GradeGridService {
    constructor() {
        this.gradeGridRepo = database_1.AppDataSource.getRepository(GradeGrid_1.GradeGrid);
        this.criterionRepo = database_1.AppDataSource.getRepository(GradeCriterion_1.GradeCriterion);
    }
    createGrid(projectId, name, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const grid = this.gradeGridRepo.create({ name, type, projectId });
            return yield this.gradeGridRepo.save(grid);
        });
    }
    addCriteria(gridId, criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            const grid = yield this.gradeGridRepo.findOneByOrFail({ id: gridId });
            const criterionEntities = criteria.map(c => this.criterionRepo.create(Object.assign(Object.assign({}, c), { grid })));
            return yield this.criterionRepo.save(criterionEntities);
        });
    }
    finalizeGrid(gridId) {
        return __awaiter(this, void 0, void 0, function* () {
            const grid = yield this.gradeGridRepo.findOneByOrFail({ id: gridId });
            grid.isFinalized = true;
            return yield this.gradeGridRepo.save(grid);
        });
    }
    getGrid(gridId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.gradeGridRepo.findOne({
                where: { id: gridId },
                relations: ['criteria'],
            });
        });
    }
}
exports.GradeGridService = GradeGridService;
