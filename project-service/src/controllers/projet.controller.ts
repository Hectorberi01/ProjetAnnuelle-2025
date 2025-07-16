import { Request, Response } from 'express';
import { ProjetService } from '../services/projet.service';

const projetService = new ProjetService();
export class ProjectController {

    static async getAllProjects(req: Request, res: Response) {
        try {
            const projects = await projetService.getAllProjects();
            res.status(200).json(projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ message: 'Failed to fetch projects' });
        }
    }

    static async getProjectById(req: Request, res: Response) {
        const { id } = req.params;
        console.log('Fetching project with ID:', id);
        try {
            const project = await projetService.getProjectById(+id);
            res.status(200).json(project);
        } catch (error) {
            console.error('Error fetching project by ID:', error);
            res.status(500).json({ message: 'Failed to fetch project by ID' });
        }
    }

    static async getProjectsByPromotionId(req: Request, res: Response) {
        const { promotionId } = req.params;
        console.log('Fetching projects for promotion ID:', promotionId);
        try {
            const projects = await projetService.getProjectsByPromotion(+promotionId);
            res.status(200).json(projects);
        } catch (error) {
            console.error('Error fetching projects by promotion:', error);
            res.status(500).json({ message: 'Failed to fetch projects by promotion' });
        }
    }

    static async createProject(req: Request, res: Response) {
        try {
            const project = await projetService.createProject(req.body);
            res.status(201).json(project);
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ message: 'Failed to create project' });
        }
    }

    static async addSoutenance(req: Request, res: Response) {
        const { id } = req.params;
        const { soutenanceDate, soutenanceDuration, lieuSoutenance } = req.body;
        try {
            const updatedProject = await projetService.addSoutenanceInfo(+id, soutenanceDate, soutenanceDuration, lieuSoutenance);
            res.status(200).json(updatedProject);
        } catch (error) {
            console.error('Error adding soutenance:', error);
            res.status(500).json({ message: 'Failed to add soutenance' });
        }
    }

    static async updateSoutenance(req: Request, res: Response) {
        const { id } = req.params;
        const { soutenanceDate, soutenanceDuration, lieuSoutenance } = req.body;
        try {
            const updatedProject = await projetService.addSoutenanceInfo(+id, soutenanceDate, soutenanceDuration, lieuSoutenance);
            res.status(200).json(updatedProject);
        } catch (error) {
            console.error('Error updating soutenance:', error);
            res.status(500).json({ message: 'Failed to update soutenance' });
        }
    }

    static async deleteProject(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const project = await projetService.deleteProject(+id);
            res.status(200).json(project);
        } catch (error) {
            console.error('Error deleting project:', error);
            res.status(500).json({ message: 'Failed to delete project' });
        }
    }

    
    static async updateProject(req: Request, res: Response) {
        const { id } = req.params;
        const projectData = req.body;

        console.log('Updating project with ID:', id, 'and data:', projectData);

        try {
            const project = await projetService.updateProject(+id, projectData);
            res.status(200).json(project);
        } catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({ message: 'Failed to update project' });
        }
    }

    static async updateProjectStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        try {
            const updatedProject = await projetService.updateProjectStatus(+id, status);
            res.status(200).json(updatedProject);
        } catch (error) {
            console.error('Error updating project status:', error);
            res.status(500).json({ message: 'Failed to update project status' });
        }
    }

    static async updateProjectMode(req: Request, res: Response) {
        const { id } = req.params;
        const { mode } = req.body;

        try {
            const updatedProject = await projetService.updateProjectMode(+id, mode);
            res.status(200).json(updatedProject);
        } catch (error) {
            console.error('Error updating project mode:', error);
            res.status(500).json({ message: 'Failed to update project mode' });
        }
    }

    static async updateProjectLatePolicy(req: Request, res: Response) {
        const { id } = req.params;
        const { allowLate } = req.body;

        try {
            const updatedProject = await projetService.updateProjectLatePolicy(+id, allowLate);
            res.status(200).json(updatedProject);
        } catch (error) {
            console.error('Error updating project late policy:', error);
            res.status(500).json({ message: 'Failed to update project late policy' });
        }
    }

    static async updateSoutenanceDate(req: Request, res: Response) {
        const { id } = req.params;
        const { soutenanceDate } = req.body;

        try {
            const updatedProject = await projetService.updateSoutenanceDate(+id, soutenanceDate);
            res.status(200).json(updatedProject);
        } catch (error) {
            console.error('Error updating soutenance date:', error);
            res.status(500).json({ message: 'Failed to update soutenance date' });
        }
    }
}