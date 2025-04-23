"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayProjectService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const services_config_1 = require("../../config/services.config");
let GatewayProjectService = class GatewayProjectService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async createProject(project) {
        try {
            const response = await fetch(`${services_config_1.SERVICES.projects}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(project),
            });
            if (!response.ok) {
                throw new Error("Failed to create project");
            }
            return await response.json();
        }
        catch (error) {
            throw new Error("Failed to create project");
        }
    }
    async getAllProjects() {
        try {
            const response = await fetch((`${services_config_1.SERVICES.projects}`));
            if (!response) {
                throw new Error("Failed to fetch projects dans le service");
            }
            return await response.json();
        }
        catch (error) {
            throw new Error("Failed to fetch projects");
        }
    }
    async getProjectById(projectId) {
        try {
            const response = await fetch(`${services_config_1.SERVICES.projects}/${projectId}`);
            if (!response) {
                throw new Error("Failed to fetch project");
            }
            return await response.json();
        }
        catch (error) {
            throw new Error("Failed to fetch project, projectId: " + projectId);
        }
    }
    async updateProject(projectId, project) {
        try {
            const response = await fetch(`${process.env.PROJETS}/${projectId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(project),
            });
            if (!response) {
                throw new Error("Failed to update project");
            }
            return await response.json();
        }
        catch (error) {
            throw new Error("Failed to update project, projectId: " + projectId);
        }
    }
    async deleteProject(projectId) {
        try {
            const response = await fetch(`${services_config_1.SERVICES.projects}/${projectId}`, { method: "DELETE", });
            if (!response) {
                throw new Error("Failed to delete project");
            }
            return await response.json();
        }
        catch (error) {
            throw new Error("Failed to delete project, projectId: " + projectId);
        }
    }
    async getProjectsByPromotion(promotionId) {
        try {
            const response = await fetch(`${services_config_1.SERVICES.projects}/promotion/${promotionId}`);
            if (!response) {
                throw new Error("Failed to fetch projects by promotion");
            }
            return await response.json();
        }
        catch (error) {
            throw new Error("Failed to fetch projects by promotion, promotionId: " + promotionId);
        }
    }
};
exports.GatewayProjectService = GatewayProjectService;
exports.GatewayProjectService = GatewayProjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GatewayProjectService);
//# sourceMappingURL=gateway.project.service.js.map