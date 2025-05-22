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
exports.GradeGridController = void 0;
const GradeGridService_1 = require("../services/GradeGridService");
const service = new GradeGridService_1.GradeGridService();
class GradeGridController {
    static createGrid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId, name, type } = req.body;
            const grid = yield service.createGrid(projectId, name, type);
            res.status(201).json(grid);
        });
    }
    static addCriteria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { criteria } = req.body;
            const result = yield service.addCriteria(Number(id), criteria);
            res.status(201).json(result);
        });
    }
    static finalize(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield service.finalizeGrid(Number(id));
            res.status(200).json(result);
        });
    }
    static getGrid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield service.getGrid(Number(id));
            res.status(200).json(result);
        });
    }
}
exports.GradeGridController = GradeGridController;
