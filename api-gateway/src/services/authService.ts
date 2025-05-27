import { SERVICES } from "../config/services.config";
import { apiClient } from "../utils/apiClient";

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

const URL_AUTH = SERVICES.auth || "http://localhost:3001/auth";

export async function LoginUser(loginData: login) {
    const { email, password } = loginData;
    try {
        const response = await apiClient.post(`${URL_AUTH}/login`, {email,password});

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

export async function LogoutUser(user: any) {
    try {
        const response = await apiClient.post(`${URL_AUTH}/logout`, user);
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

export async function RegisterUser(registerData: register) {
    const { nom, prenom, email, roleId } = registerData;
    try {
        const response = await apiClient.post(`${URL_AUTH}/register`, {
            nom,
            prenom,
            email,
            roleId,
        });
        if (response.status !== 201) {
            throw new Error('Registration failed');
        }
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw new Error('Registration failed');
    }
}

export async function forgotPassword(email: string) {
    try {
        const response = await apiClient.post(`${URL_AUTH}/forgot-password`, { email });
        if (response.status !== 200) {
            throw new Error('Forgot password failed');
        }
        return response.data;
    } catch (error) {
        console.error('Error during forgot password:', error);
        throw new Error('Forgot password failed');
    }
}

export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
    try {
        const response = await apiClient.post(`${URL_AUTH}/change-password`, { userId, oldPassword, newPassword });
        if (response.status !== 200) {
            throw new Error('Change password failed');
        }
        return response.data;
    } catch (error) {
        console.error('Error during change password:', error);
        throw new Error('Change password failed');
    }
}