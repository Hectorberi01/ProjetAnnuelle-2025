"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSectionService = void 0;
const ReportSection_entity_1 = require("../entities/ReportSection.entity");
const database_1 = require("../config/database");
const Report_entity_1 = require("../entities/Report.entity");
const sectionRepo = database_1.AppDataSource.getRepository(ReportSection_entity_1.ReportSection);
const reportRepo = database_1.AppDataSource.getRepository(Report_entity_1.Report);
class ReportSectionService {
    constructor() { }
}
exports.ReportSectionService = ReportSectionService;
