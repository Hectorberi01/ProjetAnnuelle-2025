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
        const { name, description, promotionId } = req.body;
    
        const project = await projetService.createProject(name, description, promotionId);
        res.status(201).json(project);
    }
    
    static async getProjectById(req: Request, res: Response) {
        const { id } = req.params;
        const project = await projetService.getProjectById(+id);
        res.status(200).json(project);
    }
    
    static async updateProject(req: Request, res: Response) {
        const { id } = req.params;
        const { name, description } = req.body;
    
        const project = await projetService.updateProject(+id, name, description);
        res.status(200).json(project);
    }
}