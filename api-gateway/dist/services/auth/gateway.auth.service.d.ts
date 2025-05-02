import { HttpService } from '@nestjs/axios';
interface login {
    email: string;
    password: string;
}
interface register {
    name: string;
    email: string;
    password: string;
    roleId: number;
}
export declare class GatewayAuthService {
    private readonly httpService;
    constructor(httpService: HttpService);
    login(loginData: login): Promise<any>;
    register(registerData: register): Promise<any>;
    logout(user: any): Promise<any>;
    forgotPassword(email: string): Promise<any>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<any>;
    deleteUser(userId: number): Promise<any>;
}
export {};
