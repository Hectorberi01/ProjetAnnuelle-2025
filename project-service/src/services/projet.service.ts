import { AppDataSource } from "../config/database";
import { Project } from "../entities/Project";

export interface CreateProject {
    name: string;
    description: string;
    soutenanceDate?: Date | null;
    soutenanceDuration?: number | 0;
    url?: string;
    minStudents: number;
    maxStudents: number;
    deadline: Date;
    allowLate: boolean;
    latePenaltyPerHour?: number;
    mode: 'manual' | 'random' | 'free';
    status: 'draft' | 'visible';
    promotionId: number;
}

const projetRepo = AppDataSource.getRepository(Project);
export class ProjetService {

    constructor() {}

    async getAllProjects(page: number = 1, limit: number = 10) {
        try {
            const [projects, total] = await projetRepo.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
            });
            return {
                projects,
                total,
                page,
                lastPage: Math.ceil(total / limit),
            };
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw new Error('Failed to fetch projects');
        }
    }

    async getProjectsByPromotion(promotionId: number) {
        if (!promotionId) {
            throw new Error('Promotion ID is required');
        }
        try {
            return await projetRepo.find({ where: { promotionId } });
        } catch (error) {
            console.error('Error fetching projects by promotion:', error);
            throw new Error('Failed to fetch projects by promotion');
        }
    }

    async getProjectById(id: number) {
        if (!id) {
            throw new Error('Project ID is required');
        }
        try {
            return await projetRepo.findOneByOrFail({ id });
        } catch (error) {
            console.error('Error fetching project by ID:', error);
            throw new Error('Failed to fetch project by ID');
        }
    }

    async createProject(data: CreateProject) {
        try {
            const preparedData = {
                ...data,
                soutenanceDate: data.soutenanceDate ?? undefined,  // Remplace null par undefined
                url: data.url ?? undefined
            };
            const project = projetRepo.create(preparedData);
            return await projetRepo.save(project);
        } catch (error) {
            console.error('Error creating project:', error);
            throw new Error('Failed to create project');
        }
    }

    async addSoutenanceInfo(id: number, soutenanceDate: Date, soutenanceDuration: number, lieuSoutenance: string) {
        if (!id || !soutenanceDate || !soutenanceDuration || !lieuSoutenance) {
            throw new Error('Project ID, soutenance date, duration, and location are required');
        }
        try {
            const project = await projetRepo.findOneByOrFail({ id });
            project.soutenanceDate = soutenanceDate;
            project.soutenanceDuration = soutenanceDuration;
            project.lieuSoutenance = lieuSoutenance;
            return await projetRepo.save(project);
        } catch (error) {
            console.error('Error adding soutenance info:', error);
            throw new Error('Failed to add soutenance info');
        }
    }

    async updateSoutenanceInfo(id: number, soutenanceDate: Date, soutenanceDuration: number, lieuSoutenance: string) {
        if (!id || !soutenanceDate || !soutenanceDuration || !lieuSoutenance) {
            throw new Error('Project ID, soutenance date, duration, and location are required');
        }
        try {
            const project = await projetRepo.findOneByOrFail({ id });
            project.soutenanceDate = soutenanceDate;
            project.soutenanceDuration = soutenanceDuration;
            project.lieuSoutenance = lieuSoutenance;
            return await projetRepo.save(project);
        } catch (error) {
            console.error('Error updating soutenance info:', error);
            throw new Error('Failed to update soutenance info');
        }
    }

    async updateProject(id: number, updateData: any) {
        try {
            const project = await projetRepo.findOneByOrFail({ id });
            console.log('Updating project with ID:', id, 'and data:', updateData);
            Object.assign(project, updateData);
            const updatedProject = await projetRepo.save(project);
            return updatedProject;
        } catch (error) {
            console.error('Error updating project:', error);
            throw new Error('Failed to update project');
        }
    }

    async updateProjectStatus(id: number, status: 'draft' | 'visible') {
        if (!id || !status) {
            throw new Error('Project ID and status are required');
        }
        try {
            const project = await projetRepo.findOneByOrFail({ id });
            project.status = status;
            return await projetRepo.save(project);
        } catch (error) {
            console.error('Error updating project status:', error);
            throw new Error('Failed to update project status');
        }
    }

    async updateProjectMode(id: number, mode: 'manual' | 'random' | 'free') {
        if (!id || !mode) {
            throw new Error('Project ID and mode are required');
        }
        try {
            const project = await projetRepo.findOneByOrFail({ id });
            project.mode = mode;
            return await projetRepo.save(project);
        } catch (error) {
            console.error('Error updating project mode:', error);
            throw new Error('Failed to update project mode');
        }
    }

    async updateProjectLatePolicy(id: number, allowLate: boolean) {
        if (typeof allowLate !== 'boolean' || !id) {
            throw new Error('Invalid parameters for late policy update');
        }
        try {
            const project = await projetRepo.findOneByOrFail({ id });
            project.allowLate = allowLate;
            return await projetRepo.save(project);
        } catch (error) {
            console.error('Error updating project late policy:', error);
            throw new Error('Failed to update project late policy');
        }
    }   

    async updateSoutenanceDate(id: number, soutenanceDate: Date) {
        if (!id || !soutenanceDate) {
            throw new Error('Project ID and soutenance date are required');
        }
        try {
            const project = await projetRepo.findOneByOrFail({ id });
            project.soutenanceDate = soutenanceDate;
            return await projetRepo.save(project);
        } catch (error) {
            console.error('Error updating soutenance date:', error);
            throw new Error('Failed to update soutenance date');
        }
    }
    
    async deleteProject(id: number) {
        const project = await projetRepo.findOneByOrFail({ id });
        if(!project) throw new Error('Project not found');
        return await projetRepo.remove(project);
    }
}