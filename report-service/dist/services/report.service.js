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
exports.ReportService = void 0;
const database_1 = require("../config/database");
const repo = database_1.AppDataSource.getRepository('Report');
class ReportService {
    constructor() { }
    createReport(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = repo.create(data);
                return yield repo.save(report);
            }
            catch (error) {
                console.error('Error creating report:', error);
                throw new Error('Failed to create report');
            }
        });
    }
    // Mettre à jour le rapport
    updateReport(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = yield repo.findOneBy({ id });
                if (!report)
                    throw new Error('Report not found');
                return yield repo.update({ id }, data);
            }
            catch (error) {
                console.error('Error updating report:', error);
                throw new Error('Failed to update report');
            }
        });
    }
    // Récupérer tous les rapports d'un projet
    findByProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield repo.find({ where: { projectId } });
                return reports;
            }
            catch (error) {
                console.error('Error fetching reports:', error);
                throw new Error('Failed to fetch reports');
            }
        });
    }
    // Récupérer tous les rapports
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield repo.find();
                return reports;
            }
            catch (error) {
                console.error('Error fetching reports:', error);
                throw new Error('Failed to fetch reports');
            }
        });
    }
    // Récupérer un rapport par son ID
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = yield repo.findOne({ where: { id } });
                if (!report)
                    throw new Error('Report not found');
                return report;
            }
            catch (error) {
                console.error('Error fetching report:', error);
                throw new Error('Failed to fetch report');
            }
        });
    }
    // Récupérer les rapports d'un groupe spécifique
    findByGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield repo.find({ where: { groupId } });
                return reports;
            }
            catch (error) {
                console.error('Error fetching reports by group:', error);
                throw new Error('Failed to fetch reports by group');
            }
        });
    }
    // supprimer un rapport
    deleteReport(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = yield repo.findOne({ where: { id } });
                if (!report)
                    throw new Error('Report not found');
                yield repo.delete({ id });
                return { message: 'Report deleted successfully' };
            }
            catch (error) {
                console.error('Error deleting report:', error);
                throw new Error('Failed to delete report');
            }
        });
    }
}
exports.ReportService = ReportService;
