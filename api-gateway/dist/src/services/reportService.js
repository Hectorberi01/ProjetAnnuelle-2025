"use strict";
// http://users:3005/api/reports
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
exports.getAllReports = getAllReports;
exports.createReport = createReport;
exports.getReportByProject = getReportByProject;
exports.getReportById = getReportById;
exports.getReportByGroup = getReportByGroup;
exports.updateReport = updateReport;
exports.deleteReport = deleteReport;
const services_config_1 = require("../config/services.config");
const apiClient_1 = require("../utils/apiClient");
const URL_REPORTS = services_config_1.SERVICES.reports || "http://localhost:3006/reports";
function getAllReports() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_REPORTS}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch reports');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching reports:', error);
            throw new Error('Failed to fetch reports');
        }
    });
}
function createReport(report) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.post(`${URL_REPORTS}`, report);
            if (response.status !== 201) {
                throw new Error('Failed to create report');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error creating report:', error);
            throw new Error('Failed to create report');
        }
    });
}
function getReportByProject(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_REPORTS}/projects/${projectId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch reports');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching reports:', error);
            throw new Error('Failed to fetch reports');
        }
    });
}
function getReportById(reportId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_REPORTS}/${reportId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch report');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching report:', error);
            throw new Error('Failed to fetch report');
        }
    });
}
function getReportByGroup(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_REPORTS}/groups/${groupId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch reports by group');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching reports by group:', error);
            throw new Error('Failed to fetch reports by group');
        }
    });
}
function updateReport(reportId, report) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.put(`${URL_REPORTS}/${reportId}`, report);
            if (response.status !== 200) {
                throw new Error('Failed to update report');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error updating report:', error);
            throw new Error('Failed to update report');
        }
    });
}
function deleteReport(reportId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.delete(`${URL_REPORTS}/${reportId}`);
            if (response.status !== 200) {
                throw new Error('Failed to delete report');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error deleting report:', error);
            throw new Error('Failed to delete report');
        }
    });
}
