import { Controller, Get } from "@nestjs/common";
import { GatewayProjectService } from "src/services/gateway.project.service";

@Controller('/projects')
export class ProjectController {
    constructor(private readonly projectService: GatewayProjectService) {}
    // GET all projects
    @Get()
    getAllProjects() {
        return this.projectService.getAllProjects();
    }
    // Create a new project
    // public async createProject(project: any): Promise<any> {
    //     const response = await fetch(`${process.env.PROJETS}`, {
    //     method: "POST",
    //     headers: {"Content-Type": "application/json",},
    //     body: JSON.stringify(project),
    //     });
    // 
    //     if (!response.ok) {
    //     throw new Error("Failed to create project");
    //     }
    //     return await response.json();
    // }
}