import { HttpService } from '@nestjs/axios';
export declare class GatewayProjectService {
    private readonly httpService;
    constructor(httpService: HttpService);
    createProject(project: any): Promise<any>;
    getAllProjects(): Promise<any>;
    getProjectById(projectId: number): Promise<any>;
    updateProject(projectId: number, project: any): Promise<any>;
    deleteProject(projectId: number): Promise<void>;
    getProjectsByPromotion(promotionId: number): Promise<any[]>;
}
