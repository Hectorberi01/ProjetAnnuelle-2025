import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GatewayProjectService } from "../services/projets/gateway.project.service";

@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: GatewayProjectService) {}
    // GET all projects
    @Get('/all')
    public async getAllProjects() {
        return await this.projectService.getAllProjects();
    }
    // Create a new project
    @Post('/create')
    public async createProject(@Body() project: any){
        return this.projectService.createProject(project);
    }

    // GET a project by ID
    @Get('/:id/get')
    public async getProjectById(@Param('id')  id: string): Promise<any> {
        return this.projectService.getProjectById(parseInt(id, 10));
    }
    // Update a project
    @Put(':id/update')
    public async updateProject(@Param('id') id: string, @Body()project: any): Promise<any> {
        return this.projectService.updateProject(parseInt(id, 10), project);
    }

    // Delete a project
    @Delete('/:id/delete')
    public async deleteProject(@Param('id') id: string): Promise<void> {
        return this.projectService.deleteProject(parseInt(id, 10));
    }

    // Get projects by promotion ID
    @Get('/:id/promotion')
    public async getProjectsByPromotionId(@Param('id') id: string): Promise<any> {
        return this.projectService.getProjectsByPromotion( parseInt(id, 10));
    }
}