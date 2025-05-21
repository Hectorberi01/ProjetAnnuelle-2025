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
exports.ProjectController = void 0;
const projet_service_1 = require("../services/projet.service");
const projetService = new projet_service_1.ProjetService();
class ProjectController {
    static getAllProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield projetService.getAllProjects();
            res.status(200).json(projects);
        });
    }
    static getProjectsByPromotion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { promotionId } = req.params;
            const projects = yield projetService.getProjectsByPromotion(+promotionId);
            res.status(200).json(projects);
        });
    }
    static deleteProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const project = yield projetService.deleteProject(+id);
            res.status(200).json(project);
        });
    }
    static createProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield projetService.createProject(req.body);
                res.status(201).json(project);
            }
            catch (error) {
                console.error('Error creating project:', error);
                res.status(500).json({ message: 'Failed to create project' });
            }
        });
    }
    static getProjectById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const project = yield projetService.getProjectById(+id);
            res.status(200).json(project);
        });
    }
    static updateProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const projectData = req.body;
            const project = yield projetService.updateProject(+id, projectData);
            res.status(200).json(project);
        });
    }
}
exports.ProjectController = ProjectController;
