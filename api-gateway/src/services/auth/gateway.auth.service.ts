

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class GatewayAuthService {
    constructor(
        private readonly httpService: HttpService,
    ) {}
    
    
    // ➕ Authentification
    async login(user: any) {
        try {
            const response = await lastValueFrom(this.httpService.post(`${process.env.AUTH}/login`, user));
            if (response.status !== 200) {
                throw new Error('Login failed');
            }  
            return response.data;
        }
        catch (error) {
            console.error('Error during login:', error);
            throw new Error('Login failed');
        }
    }

    async register(user: any) {
        try {
            const response = await lastValueFrom(this.httpService.post(`${process.env.AUTH}/register`, user));
            if (response.status !== 201) {
                throw new Error('Registration failed');
            }
            return response.data;
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
    async getUserInfo(userId: number) {
        try {
            const response = await lastValueFrom(this.httpService.get(`${process.env.AUTH}/user/${userId}`));
            if (response.status !== 200) {
                throw new Error('Failed to fetch user info');
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw new Error('Failed to fetch user info');
        }
    }
    async updateUser(userId: number, userData: any) {
        try {
            const response = await lastValueFrom(this.httpService.put(`${process.env.AUTH}/user/${userId}`, userData));
            if (response.status !== 200) {
                throw new Error('Failed to update user');
            }
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }
    async deleteUser(userId: number) {
        try {
            const response = await lastValueFrom(this.httpService.delete(`${process.env.AUTH}/user/${userId}`));
            if (response.status !== 200) {
                throw new Error('Failed to delete user');
            }
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    }
    async getAllUsers() {
        try {
            const response = await lastValueFrom(this.httpService.get(`${process.env.AUTH}/users`));
            if (response.status !== 200) {
                throw new Error('Failed to fetch users');
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users');
        }
    }
    async getUserById(userId: number) {
        try {
            const response = await lastValueFrom(this.httpService.get(`${process.env.AUTH}/user/${userId}`));
            if (response.status !== 200) {
                throw new Error('Failed to fetch user');
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Failed to fetch user');
        }
    }
}