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
    async login(loginData) {
        try {
            const res = await fetch(`${process.env.AUTH}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
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
    async register(registerData) {
        try {
            const res = await fetch(`${process.env.AUTH}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(registerData),
            });
            if (res.status !== 201) {
                throw new Error('Registration failed');
            }
            return res.json();
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
    async forgotPassword(email) {
        try {
            const res = await fetch(`${process.env.AUTH}/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ email }),
            });
            if (res.status !== 200) {
                throw new Error('Failed to send password reset email');
            }
            return await res.json();
        }
        catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }
    async changePassword(userId, oldPassword, newPassword) {
        try {
            const res = await fetch(`${process.env.AUTH}/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ userId, oldPassword, newPassword }),
            });
            if (res.status !== 200) {
                throw new Error('Failed to change password');
            }
            return await res.json();
        }
        catch (error) {
            console.error('Error changing password:', error);
            throw new Error('Failed to change password');
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
};
exports.GatewayAuthService = GatewayAuthService;
exports.GatewayAuthService = GatewayAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GatewayAuthService);
//# sourceMappingURL=gateway.auth.service.js.map