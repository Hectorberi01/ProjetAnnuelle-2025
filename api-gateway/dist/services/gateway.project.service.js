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
const rxjs_1 = require("rxjs");
const inspector_1 = require("inspector");
let GatewayProjectService = class GatewayProjectService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async createProject(project) {
        const response = await fetch(`${process.env.PROJETS}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(project),
        });
        if (!response.ok) {
            throw new Error("Failed to create project");
        }
        return await response.json();
    }
    async getAllProjects() {
        inspector_1.console.log("Fetching all projects from API");
        inspector_1.console.log(`${process.env.PROJETS}`);
        inspector_1.console.log("Fetching all projects from API");
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${process.env.PROJETS}`));
        if (!response) {
            throw new Error("Failed to fetch projects");
        }
        return await response.data;
    }
    async getProjectById(projectId) {
        const response = await fetch(`${process.env.PROJETS}/${projectId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch project");
        }
        return await response.json();
    }
    async updateProject(projectId, project) {
        const response = await fetch(`${process.env.PROJETS}/${projectId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(project),
        });
        if (!response.ok) {
            throw new Error("Failed to update project");
        }
        return await response.json();
    }
    async deleteProject(projectId) {
        const response = await fetch(`${process.env.PROJETS}/${projectId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete project");
        }
    }
    async getProjectsByPromotion(promotionId) {
        const response = await fetch(`${process.env.PROJETS}/promotion/${promotionId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch projects by promotion");
        }
        return await response.json();
    }
};
exports.GatewayProjectService = GatewayProjectService;
exports.GatewayProjectService = GatewayProjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GatewayProjectService);
//# sourceMappingURL=gateway.project.service.js.map