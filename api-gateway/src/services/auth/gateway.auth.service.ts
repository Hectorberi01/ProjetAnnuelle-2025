
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import {SERVICES} from '../../config/services.config';

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

@Injectable()
export class GatewayAuthService {
    constructor(
        private readonly httpService: HttpService,
    ) {}
    
    
    async login(loginData: login) {
        try {
            console.log(`${SERVICES.auth}/login`)
            const res  = await fetch(`${SERVICES.auth}/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(loginData),
            });
            if (res.status !== 200) {
                throw new Error('Login failed');
            }  
            return res.json();
        }
        catch (error) {
            console.error('Error during login:', error);
            throw new Error('Login failed');
        }
    }

    async register(registerData: register) {
        try {
            const res = await fetch(`${SERVICES.auth}/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(registerData),
            });

            if (res.status !== 201) {
                throw new Error('Registration failed');
            }

            return res.json();
        } catch (error) {
            console.error('Error during registration:', error);
            throw new Error('Registration failed');
        }   
    }

    async logout(user: any) {
        try {
            const response = await lastValueFrom(this.httpService.post(`${process.env.AUTH}/logout`, user));
            if (response.status !== 200) {
                throw new Error('Logout failed');
            }
            return response.data;
        } catch (error) {
            console.error('Error during logout:', error);
            throw new Error('Logout failed');
        }
    }
    async forgotPassword(email: string) {
        try {
            const res = await fetch(`${SERVICES.auth}/forgot-password`, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({ email }),
            });
            if (res.status !== 200) {
                throw new Error('Failed to send password reset email');
            }
            return await res.json();
            
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        try {
            const res = await fetch(`${SERVICES.auth}/change-password`, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({ userId, oldPassword, newPassword }),
            });
            if (res.status !== 200) {
                throw new Error('Failed to change password');
            }
            return await res.json();
        } catch (error) {
            console.error('Error changing password:', error);
            throw new Error('Failed to change password');
        }
    }
}