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
const express_1 = require("express");
function createProject(projectData) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        try {
            response = yield apiClient_1.apiClient.post(`${services_config_1.SERVICES.projects}`, projectData);
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
            response = yield apiClient_1.apiClient.get(`${services_config_1.SERVICES.projects}`);
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
            const response = yield apiClient_1.apiClient.get(`${services_config_1.SERVICES.projects}/${projectId}`);
            if (response.status !== 200) {
                //throw new Error('Failed to fetch project');
                return response;
            }
            else { }
            return response;
        }
        catch (error) {
            return express_1.response;
            //throw new Error('Failed to fetch project');
        }
    });
}
function updateProject(projectId, projectData) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        try {
            response = yield apiClient_1.apiClient.put(`${services_config_1.SERVICES.projects}/${projectId}`, projectData);
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
            response = yield apiClient_1.apiClient.delete(`${services_config_1.SERVICES.projects}/${projectId}`);
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
            response = yield apiClient_1.apiClient.get(`${services_config_1.SERVICES.projects}/promotion/${promotionId}`);
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
