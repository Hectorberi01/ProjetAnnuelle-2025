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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
exports.getAllProjects = getAllProjects;
exports.getProjectById = getProjectById;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
exports.getProjectsByPromotionId = getProjectsByPromotionId;
exports.addSoutenanceInfo = addSoutenanceInfo;
exports.updateSoutenanceInfo = updateSoutenanceInfo;
exports.getPublicPDFUrl = getPublicPDFUrl;
const apiClient_1 = require("../utils/apiClient");
const services_config_1 = require("../config/services.config");
const groupService_1 = require("./groupService");
const reportService_1 = require("./reportService");
const soutenanceService_1 = require("./soutenanceService");
const deliverableService_1 = require("./deliverableService");
const userService_1 = require("./userService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const URL_PROJECTS = services_config_1.SERVICES.projects || "http://localhost:3002/projects";
const URL_PROMOTIONS = services_config_1.SERVICES.promotions || "http://localhost:3007/promotions";
const URL_GROUPS = services_config_1.SERVICES.groups || "http://localhost:3004/groups";
function createProject(projectData) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        try {
            response = yield apiClient_1.apiClient.post(`${URL_PROJECTS}`, projectData);
            if (response.status !== 201) {
                return response;
            }
            return response;
        }
        catch (error) {
            console.error('Error creating project:', error);
            return response;
        }
    });
}
function getAllProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        try {
            response = yield apiClient_1.apiClient.get(`${URL_PROJECTS}`);
            if (response.status !== 200) {
                return response;
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching projects:', error);
            return response;
        }
    });
}
function getProjectById(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // recuperer le projet par son ID
            const response = yield apiClient_1.apiClient.get(`${URL_PROJECTS}/${projectId}`);
            if (response.status !== 200) {
                return { error: "Échec de récupération du projet", status: response.status };
            }
            // récupérer la promotion par son ID
            const promotionId = response.data.promotionId;
            const promotionResponse = yield apiClient_1.apiClient.get(`${URL_PROMOTIONS}/${promotionId}`);
            if (promotionResponse.status !== 200) {
                return { error: "Échec de récupération de la promotion", status: promotionResponse.status };
            }
            const promotion = promotionResponse.data;
            delete promotion.promotionStudents; // on supprime les étudiants de la promotion pour ne pas les renvoyer dans le projet
            // on récupère les groupes rattachés au projet
            const groupsResponse = yield (0, groupService_1.getGroupByProjectId)(projectId);
            //delete groupsResponse[0].projectId;
            // 4. Enrichissement de chaque groupStudent avec l'objet student
            const enrichedGroups = yield Promise.all(groupsResponse.map((group) => __awaiter(this, void 0, void 0, function* () {
                const enrichedGroupStudent = yield Promise.all(group.groupStudent.map((gs) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield (0, userService_1.getUserById)(gs.studentId);
                    return Object.assign(Object.assign({}, gs), { student: user });
                })));
                return Object.assign(Object.assign({}, group), { groupStudent: enrichedGroupStudent });
            })));
            // on récupère les livrables du projet
            const livrablesResponse = yield (0, deliverableService_1.getDeliverablesByProjectId)(projectId);
            console.log("livrablesResponse", livrablesResponse);
            // on écupère les rapports du projet
            const reportsResponse = yield (0, reportService_1.getReportByProject)(projectId);
            console.log("reportsResponse", reportsResponse);
            // on récupère les soutenances du projet
            const soutenancesResponse = yield (0, soutenanceService_1.getSoutenanceSchedule)(projectId);
            console.log("soutenancesResponse", soutenancesResponse);
            // on récupère la similarité entre les livrables
            const similarity = yield (0, deliverableService_1.similarityMatrix)(projectId);
            const result = Object.assign(Object.assign({}, response.data), { promotion: promotion, groups: enrichedGroups, reports: reportsResponse, livrables: livrablesResponse, soutenances: soutenancesResponse, similarity: similarity });
            console.log("Project details:", result);
            return result;
        }
        catch (error) {
            return { error: "Échec de récupération du projet", status: 500 };
            //throw new Error('Failed to fetch project');
        }
    });
}
function updateProject(projectId, projectData) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('dans le servcie ');
        let response = {};
        try {
            console.log("dans updateProject", projectData);
            response = yield apiClient_1.apiClient.put(`${URL_PROJECTS}/update/${projectId}`, projectData);
            if (response.status !== 200) {
                return response;
            }
            return response;
        }
        catch (error) {
            console.error('Error updating project:', error);
            return response;
        }
    });
}
function deleteProject(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        try {
            response = yield apiClient_1.apiClient.delete(`${URL_PROJECTS}/${projectId}`);
            return response;
        }
        catch (error) {
            console.error('Error deleting project:', error);
            return response;
        }
    });
}
function getProjectsByPromotionId(promotionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_PROJECTS}/promotion/${promotionId}`);
            if (response.status !== 200) {
                return [];
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching projects by promotion ID:', error);
            return [];
        }
    });
}
function addSoutenanceInfo(projectId, soutenanceData) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        try {
            response = yield apiClient_1.apiClient.post(`${URL_PROJECTS}/${projectId}/soutenance`, soutenanceData);
            if (response.status !== 200) {
                return response;
            }
            return response.data;
        }
        catch (error) {
            console.error('Error adding soutenance info:', error);
            return response;
        }
    });
}
function updateSoutenanceInfo(projectId, soutenanceData) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        try {
            response = yield apiClient_1.apiClient.put(`${URL_PROJECTS}/${projectId}/soutenance`, soutenanceData);
            if (response.status !== 200) {
                return response;
            }
            return response.data;
        }
        catch (error) {
            console.error('Error updating soutenance info:', error);
            return response;
        }
    });
}
function getPublicPDFUrl(filename) {
    return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${encodeURIComponent(filename)}`;
}
