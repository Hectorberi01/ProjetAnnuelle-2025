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
exports.ProjetService = void 0;
const database_1 = require("../config/database");
const Project_1 = require("../entities/Project");
const projetRepo = database_1.AppDataSource.getRepository(Project_1.Project);
class ProjetService {
    constructor() { }
    getAllProjects() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            try {
                const [projects, total] = yield projetRepo.findAndCount({
                    skip: (page - 1) * limit,
                    take: limit,
                });
                return {
                    projects,
                    total,
                    page,
                    lastPage: Math.ceil(total / limit),
                };
            }
            catch (error) {
                console.error('Error fetching projects:', error);
                throw new Error('Failed to fetch projects');
            }
        });
    }
    getProjectsByPromotion(promotionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!promotionId) {
                throw new Error('Promotion ID is required');
            }
            try {
                return yield projetRepo.find({ where: { promotionId } });
            }
            catch (error) {
                console.error('Error fetching projects by promotion:', error);
                throw new Error('Failed to fetch projects by promotion');
            }
        });
    }
    getProjectById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('Project ID is required');
            }
            try {
                const projet = yield projetRepo.findOneBy({ id });
                console.log('Fetched project:', projet);
                return projet;
            }
            catch (error) {
                console.error('Error fetching project by ID:', error);
                throw new Error('Failed to fetch project by ID');
            }
        });
    }
    createProject(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const preparedData = Object.assign(Object.assign({}, data), { soutenanceDate: (_a = data.soutenanceDate) !== null && _a !== void 0 ? _a : undefined, url: (_b = data.url) !== null && _b !== void 0 ? _b : undefined });
                const project = projetRepo.create(preparedData);
                return yield projetRepo.save(project);
            }
            catch (error) {
                console.error('Error creating project:', error);
                throw new Error('Failed to create project');
            }
        });
    }
    addSoutenanceInfo(id, soutenanceDate, soutenanceDuration, lieuSoutenance) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !soutenanceDate || !soutenanceDuration || !lieuSoutenance) {
                throw new Error('Project ID, soutenance date, duration, and location are required');
            }
            try {
                const project = yield projetRepo.findOneByOrFail({ id });
                project.soutenanceDate = soutenanceDate;
                project.soutenanceDuration = soutenanceDuration;
                project.lieuSoutenance = lieuSoutenance;
                return yield projetRepo.save(project);
            }
            catch (error) {
                console.error('Error adding soutenance info:', error);
                throw new Error('Failed to add soutenance info');
            }
        });
    }
    updateSoutenanceInfo(id, soutenanceDate, soutenanceDuration, lieuSoutenance) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !soutenanceDate || !soutenanceDuration || !lieuSoutenance) {
                throw new Error('Project ID, soutenance date, duration, and location are required');
            }
            try {
                const project = yield projetRepo.findOneByOrFail({ id });
                project.soutenanceDate = soutenanceDate;
                project.soutenanceDuration = soutenanceDuration;
                project.lieuSoutenance = lieuSoutenance;
                return yield projetRepo.save(project);
            }
            catch (error) {
                console.error('Error updating soutenance info:', error);
                throw new Error('Failed to update soutenance info');
            }
        });
    }
    updateProject(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield projetRepo.findOneByOrFail({ id });
                console.log('Updating project with ID:', id, 'and data:', updateData);
                Object.assign(project, updateData);
                const updatedProject = yield projetRepo.save(project);
                return updatedProject;
            }
            catch (error) {
                console.error('Error updating project:', error);
                throw new Error('Failed to update project');
            }
        });
    }
    updateProjectStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !status) {
                throw new Error('Project ID and status are required');
            }
            try {
                const project = yield projetRepo.findOneByOrFail({ id });
                project.status = status;
                return yield projetRepo.save(project);
            }
            catch (error) {
                console.error('Error updating project status:', error);
                throw new Error('Failed to update project status');
            }
        });
    }
    updateProjectMode(id, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !mode) {
                throw new Error('Project ID and mode are required');
            }
            try {
                const project = yield projetRepo.findOneByOrFail({ id });
                project.mode = mode;
                return yield projetRepo.save(project);
            }
            catch (error) {
                console.error('Error updating project mode:', error);
                throw new Error('Failed to update project mode');
            }
        });
    }
    updateProjectLatePolicy(id, allowLate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof allowLate !== 'boolean' || !id) {
                throw new Error('Invalid parameters for late policy update');
            }
            try {
                const project = yield projetRepo.findOneByOrFail({ id });
                project.allowLate = allowLate;
                return yield projetRepo.save(project);
            }
            catch (error) {
                console.error('Error updating project late policy:', error);
                throw new Error('Failed to update project late policy');
            }
        });
    }
    updateSoutenanceDate(id, soutenanceDate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !soutenanceDate) {
                throw new Error('Project ID and soutenance date are required');
            }
            try {
                const project = yield projetRepo.findOneByOrFail({ id });
                project.soutenanceDate = soutenanceDate;
                return yield projetRepo.save(project);
            }
            catch (error) {
                console.error('Error updating soutenance date:', error);
                throw new Error('Failed to update soutenance date');
            }
        });
    }
    deleteProject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Recherche du projet avec ID:', id, 'Type:', typeof id);
            const project = yield projetRepo.findOneBy({ id });
            console.log('Projet trouvé:', project);
            if (!project) {
                throw new Error("Project not found");
            }
            return yield projetRepo.remove(project);
        });
    }
}
exports.ProjetService = ProjetService;
