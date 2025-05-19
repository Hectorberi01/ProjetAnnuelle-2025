import { AppDataSource } from "../config/database";
import { Project } from "../entities/Project";

export interface CreateProject {
    name: string;
    description: string;
    soutenanceDate?: Date | null;
    minStudents: number;
    maxStudents: number;
    mode: 'manual' | 'random' | 'free';
    status: 'draft' | 'visible';
    promotionId: number;
}

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

    async createProject(data: CreateProject) {
        const preparedData = {
            ...data,
            soutenanceDate: data.soutenanceDate ?? undefined  // Remplace null par undefined
        };
        const project = projetRepo.create(preparedData);
        return await projetRepo.save(project);
    }
    
    async updateProject(id: number,updateData : any) {
        try {
            const project = await projetRepo.findOneByOrFail({ id });
            Object.assign(project, updateData);
            const updatedProject = await projetRepo.save(project);
            return updatedProject;
        } catch (error) {
            console.error('Error updating project:', error);
            throw new Error('Failed to update project');
        }
    }
    
    async deleteProject(id: number) {
        const project = await projetRepo.findOneByOrFail({ id });
        if(!project) throw new Error('Project not found');
        return await projetRepo.remove(project);
    }
}