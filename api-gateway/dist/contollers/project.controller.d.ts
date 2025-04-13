import { GatewayProjectService } from "src/services/gateway.project.service";
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: GatewayProjectService);
    getAllProjects(): Promise<any>;
}
