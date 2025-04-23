import { GatewayProjectService } from "../services/projets/gateway.project.service";
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: GatewayProjectService);
    getAllProjects(): Promise<any>;
    createProject(project: any): Promise<any>;
    getProjectById(id: string): Promise<any>;
    updateProject(id: string, project: any): Promise<any>;
    deleteProject(id: string): Promise<void>;
    getProjectsByPromotionId(id: string): Promise<any>;
}
