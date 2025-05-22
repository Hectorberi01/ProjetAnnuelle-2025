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
exports.getById = exports.getByProject = exports.getAll = exports.deleteReport = exports.update = exports.create = void 0;
const report_service_1 = require("../services/report.service");
const reportService = new report_service_1.ReportService();
// Create a new report
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Creating report');
    console.log(req.body);
    const response = yield reportService.createReport(req.body);
    if (!response) {
        res.status(404).json({ message: 'Report not created' });
        return;
    }
    res.status(201).json({
        message: 'Report created successfully',
    });
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Updating report');
    console.log(req.body);
    const reportId = parseInt(req.params.id);
    console.log('Report ID:', reportId);
    const response = yield reportService.updateReport(reportId, req.body);
    if (!response) {
        res.status(404).json({ message: 'Report not found' });
        return;
    }
    res.status(200).json({
        message: 'Report updated successfully',
    });
});
exports.update = update;
const deleteReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Deleting report');
    const reportId = parseInt(req.params.id);
    const response = yield reportService.deleteReport(reportId);
    if (!response) {
        res.status(404).json({ message: 'Report not found' });
        return;
    }
    res.status(200).json({
        message: 'Report deleted successfully',
        report: response
    });
});
exports.deleteReport = deleteReport;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Getting all reports');
    const response = yield reportService.findAll();
    if (!response) {
        res.status(404).json({ message: 'No reports found' });
        return;
    }
    res.status(200).json(response);
});
exports.getAll = getAll;
const getByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Getting reports by project');
    const projectId = parseInt(req.params.projectId);
    console.log('Project ID:', projectId);
    const response = yield reportService.findByProject(projectId);
    if (!response) {
        res.status(404).json({ message: 'No reports found for this project' });
        return;
    }
    res.status(200).json(response);
});
exports.getByProject = getByProject;
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Getting report by ID');
    const reportId = parseInt(req.params.id);
    const response = yield reportService.findById(reportId);
    if (!response) {
        res.status(404).json({ message: 'Report not found' });
        return;
    }
    res.status(200).json(response);
});
exports.getById = getById;
