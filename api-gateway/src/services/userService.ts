import { SERVICES } from "../config/services.config";
import { CreateAdmin, CreateUser, Role, User } from "../types/types";
import { apiClient } from "../utils/apiClient";
import * as env from "dotenv"
env.config();

const URL_USERS = SERVICES.users || "http://localhost:3003/users";
const URL_ROLES = SERVICES.roles || "http://localhost:3003/roles";
const URL_AUTH = SERVICES.auth || "http://localhost:3001/auth";

export async function getUserById(userId: number): Promise<any> {
    try {
        const response = await apiClient.get<User>(`${URL_USERS}/${userId}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch user');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user');
    }
}
export async function getAllUsers(): Promise<any[]> {
    try {
        console.log(`${URL_USERS}`);
        const response = await apiClient.get<User[]>(`${URL_USERS}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch users');
        }
        console.log('Fetched users:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
}
export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const user = await apiClient.get<User>(`${URL_USERS}/email/${email}`);
        if (user.status !== 200) {
           return null;
        }
       
        return user.data;
    } catch (error) {
        return null;
    }
}

export async function createUser(userData: any): Promise<User> {
    try {
        const response = await apiClient.post<User>(`${URL_USERS}`, userData);
        if (response.status !== 201) {
            throw new Error('Failed to create user');
        }
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
}


export async function updateUser(userId: string, userData: any): Promise<any> {
    try {
        const response = await apiClient.put(`${URL_USERS}/${userId}`, userData);
        if (response.status !== 200) {
            throw new Error('Failed to update user');
        }
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user');
    }
}

export async function deleteUser(userId: number): Promise<any> {
    try {
        const response = await apiClient.delete(`${URL_USERS}/${userId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete user');
        }
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
    }
}

export async function getStudents(): Promise<any[]> {
    try {
        const allUsers = await getAllUsers();
        const studentsList = allUsers.filter((user: any) => user.role.name === "student".toUpperCase);
        return studentsList;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw new Error('Failed to fetch students');
    }
}
export async function getTeachers(): Promise<any[]> {
    try {
        const allUsers = await getAllUsers();
        const teachersList = allUsers.filter((user: any) => user.role.name === "teacher");
        return teachersList;
    } catch (error) {
        console.error('Error fetching teachers:', error);
        throw new Error('Failed to fetch teachers');
    }
}
export async function getAdmins(): Promise<any[]> {
    try {
        const allUsers = await getAllUsers();
        const adminsList = allUsers.filter((user: any) => user.role.name === "admin");
        return adminsList;
    } catch (error) {
        console.error('Error fetching admins:', error);
        throw new Error('Failed to fetch admins');
    }
}

export async function getRoleIdByName(roleName: string): Promise<Role> {
    try {
        const response = await apiClient.get<Role>(`${URL_ROLES}/${roleName}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch role ID by name');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching role ID by name:', error);
        throw new Error('Failed to fetch role ID by name');
    }
}