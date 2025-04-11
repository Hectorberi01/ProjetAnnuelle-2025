import { AppDataSource } from "../config/database";
import { Project } from "../entities/Project";

const projetRepo = AppDataSource.getRepository(Project);
export class ProjetService {

    constructor() {
    }
    async getAllProjects() {
        return await projetRepo.find();
    }
    async getProjectsByPromotion(promotionId: number) {
        return await projetRepo.find({ where: { promotionId } });
    }
    async getProjectById(id: number) {
        return await projetRepo.findOneByOrFail({ id });   
    }
    async createProject(name: string, description: string, promotionId: number) {
        const project = projetRepo.create({ name, description, promotionId });
        return await projetRepo.save(project);
    }
    
    async updateProject(id: number, name?: string, description?: string) {
        const project = await projetRepo.findOneByOrFail({ id });
        if(!project) throw new Error('Project not found');
        if(name) project.name = name;
        if(description) project.description = description;
        return await projetRepo.save(project);
    }
    
    async deleteProject(id: number) {
        const project = await projetRepo.findOneByOrFail({ id });
        if(!project) throw new Error('Project not found');
        return await projetRepo.remove(project);
    }
}