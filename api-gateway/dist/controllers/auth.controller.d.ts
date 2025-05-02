import { GatewayAuthService } from "../services/auth/gateway.auth.service";
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
export declare class AuthController {
    private readonly authService;
    constructor(authService: GatewayAuthService);
    login(loginData: login): Promise<any>;
    register(registerData: register): Promise<any>;
    logout(user: any): Promise<any>;
    forgotPassword(email: string): Promise<any>;
    resetPassword(data: {
        userId: string;
        oldPassword: string;
        newPassword: string;
    }): Promise<any>;
}
export {};
