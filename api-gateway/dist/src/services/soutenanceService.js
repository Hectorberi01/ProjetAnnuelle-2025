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
exports.generateSoutenanceSchedule = generateSoutenanceSchedule;
exports.getSoutenanceSchedule = getSoutenanceSchedule;
exports.updateSoutenanceSlot = updateSoutenanceSlot;
const services_config_1 = require("../config/services.config");
const projectService_1 = require("./projectService");
const SOUTENANCES_URL = services_config_1.SERVICES.soutenances;
function generateSoutenanceSchedule(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield (0, projectService_1.getProjectById)(projectId);
            if (!project || !Array.isArray(project.groups)) {
                throw new Error((project && project.error)
                    ? `Project fetch error: ${project.error}`
                    : 'Project does not contain groups');
            }
            const projectIds = project.groups.map((group) => group.id);
            console.log('Project IDs:', projectIds);
            const startTime = new Date(project.soutenanceDate);
            const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);
            const data = {
                projectId: projectId,
                groupIds: projectIds,
                mode: 'auto',
                durationInMinutes: project.soutenanceDuration,
                startTime,
                endTime
            };
            console.log('Data to send:', data);
            const response = yield fetch(`${SOUTENANCES_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to generate soutenance schedule');
            }
            return yield response.json();
        }
        catch (error) {
            console.error('Error generating soutenance schedule:', error);
            throw error;
        }
    });
}
function getSoutenanceSchedule(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${SOUTENANCES_URL}/${projectId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch soutenance schedule');
            }
            return yield response.json();
        }
        catch (error) {
            console.error('Error fetching soutenance schedule:', error);
            throw error;
        }
    });
}
function updateSoutenanceSlot(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${SOUTENANCES_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to update soutenance slot');
            }
            return yield response.json();
        }
        catch (error) {
            console.error('Error updating soutenance slot:', error);
            throw error;
        }
    });
}
