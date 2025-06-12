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
exports.SoutenanceController = void 0;
const soutenanceService_1 = require("../services/soutenanceService");
class SoutenanceController {
    static generate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schedules = yield soutenanceService_1.SoutenanceService.generateSchedule(req.body);
                res.status(201).json(schedules);
            }
            catch (e) {
                res.status(500).json({ message: 'Erreur de génération', error: e });
            }
        });
    }
    static get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectId = parseInt(req.params.projectId);
            const schedules = yield soutenanceService_1.SoutenanceService.getSchedule(projectId);
            res.json(schedules);
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            const data = req.body;
            const updated = yield soutenanceService_1.SoutenanceService.updateSlot(id, data);
            res.json(updated);
        });
    }
}
exports.SoutenanceController = SoutenanceController;
