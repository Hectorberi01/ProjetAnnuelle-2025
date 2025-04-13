import { HttpService } from '@nestjs/axios';
export declare class GatewayAuthService {
    private readonly httpService;
    constructor(httpService: HttpService);
    login(user: any): Promise<any>;
    register(user: any): Promise<any>;
    logout(user: any): Promise<any>;
    getUserInfo(userId: number): Promise<any>;
    updateUser(userId: number, userData: any): Promise<any>;
    deleteUser(userId: number): Promise<any>;
    getAllUsers(): Promise<any>;
    getUserById(userId: number): Promise<any>;
}
