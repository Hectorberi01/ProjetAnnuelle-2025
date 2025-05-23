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
exports.createProject = createProject;
exports.getAllProjects = getAllProjects;
exports.getProjectById = getProjectById;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
exports.getProjectsByPromotionId = getProjectsByPromotionId;
const apiClient_1 = require("../utils/apiClient");
const services_config_1 = require("../config/services.config");
const groupService_1 = require("./groupService");
const URL_PROJECTS = services_config_1.SERVICES.projects || "http://localhost:3002/api/projects";
const URL_PROMOTIONS = services_config_1.SERVICES.promotions || "http://localhost:3007/api/promotions";
const URL_GROUPS = services_config_1.SERVICES.groups || "http://localhost:3004/api/groups";
function createProject(projectData) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        try {
            response = yield apiClient_1.apiClient.post(`${URL_PROJECTS}`, projectData);
            console.log("response", response);
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
            console.log('projectId', projectId);
            // recuperer le projet par son ID
            const response = yield apiClient_1.apiClient.get(`${URL_PROJECTS}/${projectId}`);
            if (response.status !== 200) {
                return { error: "Échec de récupération du projet", status: response.status };
            }
            console.log('response', response);
            // récupérer la promotion par son ID
            const promotionId = response.data.promotionId;
            const promotionResponse = yield apiClient_1.apiClient.get(`${URL_PROMOTIONS}/${promotionId}`);
            if (promotionResponse.status !== 200) {
                return { error: "Échec de récupération de la promotion", status: promotionResponse.status };
            }
            // on récupère les groupes rattachés au projet
            const groupsResponse = yield (0, groupService_1.getGroupByProjectId)(projectId);
            console.log('groupsResponse', groupsResponse);
            console.log('promotionResponse', promotionResponse);
            const result = Object.assign(Object.assign({}, response.data), { promotion: promotionResponse.data, groups: groupsResponse });
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
        let response = {};
        try {
            response = yield apiClient_1.apiClient.put(`${URL_PROJECTS}/${projectId}`, projectData);
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
            if (response.status !== 200) {
                return response;
            }
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
        let response = {};
        try {
            response = yield apiClient_1.apiClient.get(`${URL_PROJECTS}/promotion/${promotionId}`);
            if (response.status !== 200) {
                return response;
            }
            return response;
        }
        catch (error) {
            console.error('Error fetching projects by promotion ID:', error);
            return response;
        }
    });
}
