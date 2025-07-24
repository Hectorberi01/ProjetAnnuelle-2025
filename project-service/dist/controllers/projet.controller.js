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
            try {
                const projects = yield projetService.getAllProjects();
                res.status(200).json(projects);
            }
            catch (error) {
                console.error('Error fetching projects:', error);
                res.status(500).json({ message: 'Failed to fetch projects' });
            }
        });
    }
    static getProjectById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log('Fetching project with ID:', id);
            try {
                const project = yield projetService.getProjectById(+id);
                console.log('Fetched project:', project);
                res.status(200).json(project);
            }
            catch (error) {
                console.error('Error fetching project by ID:', error);
                res.status(500).json({ message: 'Failed to fetch project by ID' });
            }
        });
    }
    static getProjectsByPromotionId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { promotionId } = req.params;
            console.log('Fetching projects for promotion ID:', promotionId);
            try {
                const projects = yield projetService.getProjectsByPromotion(+promotionId);
                res.status(200).json(projects);
            }
            catch (error) {
                console.error('Error fetching projects by promotion:', error);
                res.status(500).json({ message: 'Failed to fetch projects by promotion' });
            }
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
    static addSoutenance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { soutenanceDate, soutenanceDuration, lieuSoutenance } = req.body;
            try {
                const updatedProject = yield projetService.addSoutenanceInfo(+id, soutenanceDate, soutenanceDuration, lieuSoutenance);
                res.status(200).json(updatedProject);
            }
            catch (error) {
                console.error('Error adding soutenance:', error);
                res.status(500).json({ message: 'Failed to add soutenance' });
            }
        });
    }
    static updateSoutenance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { soutenanceDate, soutenanceDuration, lieuSoutenance } = req.body;
            try {
                const updatedProject = yield projetService.addSoutenanceInfo(+id, soutenanceDate, soutenanceDuration, lieuSoutenance);
                res.status(200).json(updatedProject);
            }
            catch (error) {
                console.error('Error updating soutenance:', error);
                res.status(500).json({ message: 'Failed to update soutenance' });
            }
        });
    }
    static deleteProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // Ajoutez cette vérification pour déboguer
            console.log('ID reçu:', id, 'Type:', typeof id);
            const numericId = +id;
            console.log('ID converti:', numericId, 'Type:', typeof numericId);
            if (isNaN(numericId)) {
                res.status(400).json({ message: 'Invalid project ID' });
            }
            try {
                const project = yield projetService.deleteProject(numericId);
                res.status(200).json(project);
            }
            catch (error) {
                console.error('Error deleting project:', error);
                const errorMessage = (error instanceof Error) ? error.message : 'Failed to delete project';
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    static updateProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const projectData = req.body;
            console.log('Updating project with ID:', id, 'and data:', projectData);
            try {
                const project = yield projetService.updateProject(+id, projectData);
                res.status(200).json(project);
            }
            catch (error) {
                console.error('Error updating project:', error);
                res.status(500).json({ message: 'Failed to update project' });
            }
        });
    }
    static updateProjectStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status } = req.body;
            try {
                const updatedProject = yield projetService.updateProjectStatus(+id, status);
                res.status(200).json(updatedProject);
            }
            catch (error) {
                console.error('Error updating project status:', error);
                res.status(500).json({ message: 'Failed to update project status' });
            }
        });
    }
    static updateProjectMode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { mode } = req.body;
            try {
                const updatedProject = yield projetService.updateProjectMode(+id, mode);
                res.status(200).json(updatedProject);
            }
            catch (error) {
                console.error('Error updating project mode:', error);
                res.status(500).json({ message: 'Failed to update project mode' });
            }
        });
    }
    static updateProjectLatePolicy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { allowLate } = req.body;
            try {
                const updatedProject = yield projetService.updateProjectLatePolicy(+id, allowLate);
                res.status(200).json(updatedProject);
            }
            catch (error) {
                console.error('Error updating project late policy:', error);
                res.status(500).json({ message: 'Failed to update project late policy' });
            }
        });
    }
    static updateSoutenanceDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { soutenanceDate } = req.body;
            try {
                const updatedProject = yield projetService.updateSoutenanceDate(+id, soutenanceDate);
                res.status(200).json(updatedProject);
            }
            catch (error) {
                console.error('Error updating soutenance date:', error);
                res.status(500).json({ message: 'Failed to update soutenance date' });
            }
        });
    }
}
exports.ProjectController = ProjectController;
