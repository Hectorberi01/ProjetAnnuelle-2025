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
const reportService_1 = require("../services/reportService");
const router = (0, express_1.Router)();
// Créer un rapport
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const report = req.body;
        const createdReport = yield (0, reportService_1.createReport)(report);
        res.status(201).json(createdReport);
    }
    catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: "Failed to create report" });
    }
}));
// All reports
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reports = yield (0, reportService_1.getAllReports)();
        res.status(200).json(reports);
    }
    catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
}));
// Get report by project
router.get('/projects/:projectId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = parseInt(req.params.projectId);
    try {
        const reports = yield (0, reportService_1.getReportByProject)(projectId);
        if (reports.length === 0) {
            res.status(404).json({ message: "No reports found for this project" });
            return;
        }
        res.status(200).json(reports);
    }
    catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
}));
// Get report by ID
router.get('/:reportId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reportId = parseInt(req.params.reportId);
    try {
        const report = yield (0, reportService_1.getReportById)(reportId);
        if (!report) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(200).json(report);
    }
    catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: "Failed to fetch report" });
    }
}));
// Update report
router.put('/:reportId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reportId = parseInt(req.params.reportId);
    const report = req.body;
    try {
        const updatedReport = yield (0, reportService_1.updateReport)(reportId, report);
        if (!updatedReport) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(200).json(updatedReport);
    }
    catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: "Failed to update report" });
    }
}));
// Delete report
router.delete('/:reportId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reportId = parseInt(req.params.reportId);
    try {
        const deletedReport = yield (0, reportService_1.deleteReport)(reportId);
        if (!deletedReport) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(200).json({ message: "Report deleted successfully" });
    }
    catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: "Failed to delete report" });
    }
}));
exports.default = router;
