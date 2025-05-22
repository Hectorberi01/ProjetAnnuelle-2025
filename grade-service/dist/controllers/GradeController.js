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
exports.GradeController = void 0;
const GradeService_1 = require("../services/GradeService");
const service = new GradeService_1.GradeService();
class GradeController {
    static submitGrades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { gridId, groupId } = req.params;
            const { grades } = req.body;
            const result = yield service.submitGrades(+gridId, +groupId, grades);
            res.status(201).json(result);
        });
    }
    static addGlobalComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { gridId, groupId } = req.params;
            const { content } = req.body;
            const result = yield service.addGlobalComment(+gridId, +groupId, content);
            res.status(201).json(result);
        });
    }
    static getGrades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { groupId } = req.params;
            const result = yield service.getGradesForGroup(+groupId);
            res.status(200).json(result);
        });
    }
}
exports.GradeController = GradeController;
