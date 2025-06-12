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
const express_1 = require("express");
const soutenanceService_1 = require("../services/soutenanceService");
const router = (0, express_1.Router)();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedules = yield (0, soutenanceService_1.generateSoutenanceSchedule)(req.body);
        res.status(201).json(schedules);
    }
    catch (e) {
        console.error('Error generating schedule:', e);
        res.status(500).json({ message: 'Erreur de génération', error: e });
    }
}));
router.get('/:projectId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = parseInt(req.params.projectId);
    try {
        // Call the service to get the schedule
        const schedules = yield (0, soutenanceService_1.getSoutenanceSchedule)(projectId);
        res.status(200).json(schedules);
    }
    catch (e) {
        console.error('Error fetching schedule:', e);
        res.status(500).json({ message: 'Erreur de récupération', error: e });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const data = req.body;
    try {
        const updated = yield (0, soutenanceService_1.updateSoutenanceSlot)(id, data);
        res.status(200).json(updated);
    }
    catch (e) {
        console.error('Error updating slot:', e);
        res.status(500).json({ message: 'Erreur de mise à jour', error: e });
    }
}));
exports.default = router;
