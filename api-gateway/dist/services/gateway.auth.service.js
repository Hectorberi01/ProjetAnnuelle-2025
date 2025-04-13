"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayAuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let GatewayAuthService = class GatewayAuthService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async login(user) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${process.env.AUTH}/login`, user));
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
    async register(user) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${process.env.AUTH}/register`, user));
            if (response.status !== 201) {
                throw new Error('Registration failed');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error during registration:', error);
            throw new Error('Registration failed');
        }
    }
    async logout(user) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${process.env.AUTH}/logout`, user));
            if (response.status !== 200) {
                throw new Error('Logout failed');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error during logout:', error);
            throw new Error('Logout failed');
        }
    }
    async getUserInfo(userId) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${process.env.AUTH}/user/${userId}`));
            if (response.status !== 200) {
                throw new Error('Failed to fetch user info');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching user info:', error);
            throw new Error('Failed to fetch user info');
        }
    }
    async updateUser(userId, userData) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.put(`${process.env.AUTH}/user/${userId}`, userData));
            if (response.status !== 200) {
                throw new Error('Failed to update user');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }
    async deleteUser(userId) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.delete(`${process.env.AUTH}/user/${userId}`));
            if (response.status !== 200) {
                throw new Error('Failed to delete user');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    }
    async getAllUsers() {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${process.env.AUTH}/users`));
            if (response.status !== 200) {
                throw new Error('Failed to fetch users');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users');
        }
    }
    async getUserById(userId) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${process.env.AUTH}/user/${userId}`));
            if (response.status !== 200) {
                throw new Error('Failed to fetch user');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Failed to fetch user');
        }
    }
};
exports.GatewayAuthService = GatewayAuthService;
exports.GatewayAuthService = GatewayAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GatewayAuthService);
//# sourceMappingURL=gateway.auth.service.js.map