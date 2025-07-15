"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = LoginUser;
exports.LogoutUser = LogoutUser;
exports.RegisterUser = RegisterUser;
exports.RegisterAdminUser = RegisterAdminUser;
exports.forgotPassword = forgotPassword;
exports.changePassword = changePassword;
const services_config_1 = require("../config/services.config");
const apiClient_1 = require("../utils/apiClient");
const URL_AUTH = services_config_1.SERVICES.auth;
function LoginUser(loginData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = loginData;
        console.log(`auth url ${URL_AUTH}/login`);
        try {
            const response = yield apiClient_1.apiClient.post(`${URL_AUTH}/login`, { email, password });
            if (response.status !== 200) {
                throw new Error('Login failed');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error during login:', error);
            throw new Error('Login failed');
        }
    });
}
function LogoutUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.post(`${URL_AUTH}/logout`, user);
            if (response.status !== 200) {
                throw new Error('Logout failed');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error during logout:', error);
            throw new Error('Logout failed');
        }
    });
}
function RegisterUser(registerData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nom, prenom, email, address, phoneNumber, roleId } = registerData;
        const payload = {
            nom,
            prenom,
            email,
            roleId,
            phoneNumber,
            address,
        };
        try {
            const response = yield apiClient_1.apiClient.post(`${URL_AUTH}/register`, payload);
            if (response.status !== 201) {
                throw new Error('Registration failed');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error during registration:', error);
            throw new Error('Registration failed');
        }
    });
}
function RegisterAdminUser(registerData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nom, prenom, email, password } = registerData;
        try {
            const response = yield apiClient_1.apiClient.post(`${URL_AUTH}/register-admin`, {
                nom,
                prenom,
                email,
                password,
            });
            if (response.status !== 201) {
                throw new Error('Admin registration failed');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error during admin registration:', error);
            throw new Error('Admin registration failed');
        }
    });
}
function forgotPassword(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.post(`${URL_AUTH}/forgot-password`, { email });
            if (response.status !== 200) {
                throw new Error('Forgot password failed');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error during forgot password:', error);
            throw new Error('Forgot password failed');
        }
    });
}
function changePassword(userId, oldPassword, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.post(`${URL_AUTH}/change-password`, { userId, oldPassword, newPassword });
            if (response.status !== 200) {
                throw new Error('Change password failed');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error during change password:', error);
            throw new Error('Change password failed');
        }
    });
}
