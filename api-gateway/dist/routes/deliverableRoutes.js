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
const deliverableService_1 = require("../services/deliverableService");
const router = (0, express_1.Router)();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = req.body; // Assuming the body contains FormData
        const result = yield (0, deliverableService_1.submitDeliverable)(formData);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error submitting deliverable:', error);
        res.status(500).json({ message: 'Failed to submit deliverable', error: error });
    }
}));
router.get('/:id/download', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deliverableId = parseInt(req.params.id);
    try {
        const blob = yield (0, deliverableService_1.downloadDeliverable)(deliverableId);
        res.setHeader('Content-Disposition', `attachment; filename=deliverable-${deliverableId}.zip`);
        res.setHeader('Content-Type', 'application/zip');
        res.send(blob);
    }
    catch (error) {
        console.error(`Error downloading deliverable with ID ${deliverableId}:`, error);
        res.status(500).json({ message: `Failed to download deliverable with ID ${deliverableId}`, error: error });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliverables = yield (0, deliverableService_1.getAllDeliverables)();
        res.status(200).json(deliverables);
    }
    catch (error) {
        console.error('Error fetching deliverables:', error);
        res.status(500).json({ message: 'Failed to fetch deliverables', error: error });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deliverableId = parseInt(req.params.id);
    try {
        const deliverable = yield (0, deliverableService_1.getDeliverableById)(deliverableId);
        res.status(200).json(deliverable);
    }
    catch (error) {
        console.error(`Error fetching deliverable with ID ${deliverableId}:`, error);
        res.status(500).json({ message: `Failed to fetch deliverable with ID ${deliverableId}`, error: error });
    }
}));
router.get('/groups/:groupId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.groupId);
    try {
        const deliverables = yield (0, deliverableService_1.getDeliverablesByGroup)(groupId);
        res.status(200).json(deliverables);
    }
    catch (error) {
        console.error(`Error fetching deliverables for group ID ${groupId}:`, error);
        res.status(500).json({ message: `Failed to fetch deliverables for group ID ${groupId}`, error: error });
    }
}));
router.post('/internal/similarity-check/project/:projectId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = parseInt(req.params.projectId);
    try {
        const result = yield (0, deliverableService_1.similarityCheck)(projectId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(`Error checking similarity for project ID ${projectId}:`, error);
        res.status(500).json({ message: `Failed to check similarity for project ID ${projectId}`, error: error });
    }
}));
router.get('/projects/:projectId/similarity-matrix', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = parseInt(req.params.projectId);
    try {
        const matrix = yield (0, deliverableService_1.similarityMatrix)(projectId);
        res.status(200).json(matrix);
    }
    catch (error) {
        console.error(`Error fetching similarity matrix for project ID ${projectId}:`, error);
        res.status(500).json({ message: `Failed to fetch similarity matrix for project ID ${projectId}`, error: error });
    }
}));
exports.default = router;
