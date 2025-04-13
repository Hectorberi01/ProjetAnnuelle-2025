import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { console } from 'inspector';

@Injectable()
export class GatewayProjectService {

    public constructor(
        private readonly httpService: HttpService,
    ) {}

    // Create a new project
    public async createProject(project: any): Promise<any> {
        const response = await fetch(`${process.env.PROJETS}`, {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(project),
        });

        if (!response.ok) {
        throw new Error("Failed to create project");
        }
        return await response.json();
    }

    // GET all projects
    async getAllProjects() {
        console.log(`${process.env.PROJETS}`);
        const response = await lastValueFrom(this.httpService.get(`${process.env.PROJETS}`));
        if (!response) {
        throw new Error("Failed to fetch projects");
        }
        return await response.data;
    }
  
    // GET a project by ID
    public async getProjectById(projectId: number): Promise<any> {
        const response = await fetch(`${process.env.PROJETS}/${projectId}`);
        if (!response.ok) {throw new Error("Failed to fetch project");}
        return await response.json();
    }
    // Update a project
    public async updateProject(projectId: number, project: any): Promise<any> {
        const response = await fetch(`${process.env.PROJETS}/${projectId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(project),
        });

        if (!response.ok) {throw new Error("Failed to update project");}
        return await response.json();
    }
    // Delete a project
    public async deleteProject(projectId: number): Promise<void> {
        const response = await fetch(`${process.env.PROJETS}/${projectId}`, {
        method: "DELETE",
        });
        if (!response.ok) {throw new Error("Failed to delete project");}
    }
    // GET projects by promotion
    public async getProjectsByPromotion(promotionId: number): Promise<any[]> {
        const response = await fetch(`${process.env.PROJETS}/promotion/${promotionId}`);
        if (!response.ok) {throw new Error("Failed to fetch projects by promotion");}
        return await response.json();
    }
}