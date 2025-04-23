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
    constructor() {
    }
    getAllProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield projetRepo.find();
        });
    }
    getProjectsByPromotion(promotionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield projetRepo.find({ where: { promotionId } });
        });
    }
    getProjectById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield projetRepo.findOneByOrFail({ id });
        });
    }
    createProject(name, description, promotionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = projetRepo.create({ name, description, promotionId });
            return yield projetRepo.save(project);
        });
    }
    updateProject(id, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield projetRepo.findOneByOrFail({ id });
            if (!project)
                throw new Error('Project not found');
            if (name)
                project.name = name;
            if (description)
                project.description = description;
            return yield projetRepo.save(project);
        });
    }
    deleteProject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield projetRepo.findOneByOrFail({ id });
            if (!project)
                throw new Error('Project not found');
            return yield projetRepo.remove(project);
        });
    }
}
exports.ProjetService = ProjetService;
