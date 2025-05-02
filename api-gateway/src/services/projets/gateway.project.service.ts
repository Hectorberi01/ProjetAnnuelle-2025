import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SERVICES } from '../../config/services.config'
import { GatewayGroupService } from '../groupe/gatewaye.groupe.service';


@Injectable()
export class GatewayProjectService {

    public constructor(
        private readonly httpService: HttpService,
    ) {}

    private readonly GroupService = new GatewayGroupService(this.httpService);
    // Create a new project
    public async createProject(project: any): Promise<any> {
        try {
            const response = await fetch(`${SERVICES.projects}`, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(project),
            });
    
            if (!response.ok) {
                throw new Error("Failed to create project");
            }
            return await response.json();
        }catch (error) {
            throw new Error("Failed to create project");
        }
    }

    // GET all projects
    public async getAllProjects() {
        try {
            const response = await fetch((`${SERVICES.projects}`));
            if (!response) {
                throw new Error("Failed to fetch projects dans le service");
            }
            const projects = await response.json();
            // On récupère tous les groupes 
            const groupes = await this.GroupService.getAllGroups();
            // Tu peux maintenant enrichir les projets si besoin, exemple :
            const enrichedProjects = projects.map((project: any) => {
                return {
                    ...project,
                    groups: groupes.filter((g: any) => g.projectId === project.id),
                };
            });
            return  enrichedProjects ;
        }catch (error) {
            throw new Error("Failed to fetch projects");
        }
    }
  
    // GET a project by ID
    public async getProjectById(projectId: number){
        try {
            const response = await fetch(`${SERVICES.projects}/${projectId}`);
            if (!response) {
                throw new Error("Failed to fetch project");
            }

            return await response.json();
        }catch (error) {
        throw new Error("Failed to fetch project, projectId: " + projectId);
        }
    }

    // Update a project
    public async updateProject(projectId: number, project: any){
        try {
            const response = await fetch(`${process.env.PROJETS}/${projectId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(project),
            });

            if (!response) {
                throw new Error("Failed to update project");
            }
            return await response.json();
        }catch (error) {
            throw new Error("Failed to update project, projectId: " + projectId);
        }
    }
    // Delete a project
    public async deleteProject(projectId: number){
        try {
            const response = await fetch(`${SERVICES.projects}/${projectId}`, {method: "DELETE",});

            if (!response) {throw new Error("Failed to delete project");}

            return await response.json();
        }catch (error) {
            throw new Error("Failed to delete project, projectId: " + projectId);
        }
        
    }
    // GET projects by promotion
    public async getProjectsByPromotion(promotionId: number){
        try{
            const response = await fetch(`${SERVICES.projects}/promotion/${promotionId}`);
            
            if (!response) {
                throw new Error("Failed to fetch projects by promotion");
            }

            return await response.json();
        }catch (error) {
            throw new Error("Failed to fetch projects by promotion, promotionId: " + promotionId);
        }
    }
}