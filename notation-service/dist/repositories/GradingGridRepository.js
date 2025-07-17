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
exports.GradingGridRepository = void 0;
const database_1 = require("../config/database");
const GradingGrid_1 = require("../entities/GradingGrid");
class GradingGridRepository {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(GradingGrid_1.GradingGrid);
    }
    create(gridData) {
        return __awaiter(this, void 0, void 0, function* () {
            const grid = this.repository.create(gridData);
            return yield this.repository.save(grid);
        });
    }
    findByParams(projectId, groupId, type, referenceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findOne({
                where: { projectId, groupId, type, referenceId }
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
    findByProjectId(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find({
                where: { projectId },
                order: { createdAt: 'ASC' }
            });
        });
    }
    findValidatedByProjectAndGroup(projectId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find({
                where: { projectId, groupId, isValidated: true }
            });
        });
    }
    findByProjectAndGroup(projectId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find({
                where: { projectId, groupId }
            });
        });
    }
}
exports.GradingGridRepository = GradingGridRepository;
