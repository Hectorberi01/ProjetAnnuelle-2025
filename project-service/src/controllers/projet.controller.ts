import { Request, Response } from 'express';
import { ProjetService } from '../services/projet.service';

const projetService = new ProjetService();
export class ProjectController {

    static async getAllProjects(req: Request, res: Response) {
        const projects = await projetService.getAllProjects();
        res.status(200).json(projects);
    }
    static async getProjectsByPromotion(req: Request, res: Response) {
        const { promotionId } = req.params;
        const projects = await projetService.getProjectsByPromotion(+promotionId);
        res.status(200).json(projects);
    }
    static async deleteProject(req: Request, res: Response) {
        const { id } = req.params;
        const project = await projetService.deleteProject(+id);
        res.status(200).json(project);
    }

    static async createProject(req: Request, res: Response) {
        try{
            const project = await projetService.createProject(req.body);
            res.status(201).json(project);
        }catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ message: 'Failed to create project' });
        }
        
    }
    
    static async getProjectById(req: Request, res: Response) {
        const { id } = req.params;
        const project = await projetService.getProjectById(+id);
        res.status(200).json(project);
    }
    
    static async updateProject(req: Request, res: Response) {
        const { id } = req.params;
        const projectData = req.body;
    
        const project = await projetService.updateProject(+id, projectData);
        res.status(200).json(project);
    }
}