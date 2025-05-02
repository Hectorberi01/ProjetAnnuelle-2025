import { Body, Controller, Post } from "@nestjs/common";
import { GatewayAuthService } from "../services/auth/gateway.auth.service";

interface login{
    email: string;
    password: string;
}
interface register{
    nom: string;
    prenom: string;
    email: string;
    roleId: number;
}
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: GatewayAuthService,
    ) {}

    @Post('/login')
    async login(@Body() loginData: login) {
        console.log('loginData', loginData);
        return this.authService.login(loginData);
    }

    @Post('/register')
    async register(@Body() registerData: register) {
        return this.authService.register(registerData);
    }

    @Post('/logout')
    async logout(@Body() user: any) {
        return this.authService.logout(user);
    }

    @Post('/forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    @Post('/change-password')
    async resetPassword(@Body() data: { userId: string;  oldPassword: string, newPassword: string}) {
        return this.authService.changePassword(data.userId, data.oldPassword, data.newPassword);
    }
}