import { SERVICES } from "../config/services.config";
import { CreateUser, Role, User } from "../types/types";
import { apiClient } from "../utils/apiClient";
import * as env from "dotenv"
env.config();

export async function getUserById(userId: string): Promise<any> {
    try {
        const response = await apiClient.get<User>(`${SERVICES.users}/${userId}`);
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
        console.log("avant le get all users");
        console.log(`${SERVICES.users}`);
        console.log("après le get all users");
        const response = await apiClient.get<User[]>(`${SERVICES.users}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch users');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
}
export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const user = await apiClient.get<User>(`${SERVICES.users}/email/${email}`);
        if (user.status !== 200) {
           return null;
        }
       
        return user.data;
    } catch (error) {
        return null;
    }
}

export async function createUser(userData: CreateUser): Promise<User> {
    try {
        const response = await apiClient.post<User>(`${SERVICES.users}`, userData);
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
        const response = await apiClient.put(`${SERVICES.users}/${userId}`, userData);
        if (response.status !== 200) {
            throw new Error('Failed to update user');
        }
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user');
    }
}

export async function deleteUser(userId: string): Promise<any> {
    try {
        const response = await apiClient.delete(`${SERVICES.users}/${userId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete user');
        }
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
    }
}

// export async function getUserByName(userName: string): Promise<any> {
//     try {
//         const response = await apiClient.get(`/users/name/${userName}`);
//         if (response.status !== 200) {
//             throw new Error('Failed to fetch user by name');
//         }
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching user by name:', error);
//         throw new Error('Failed to fetch user by name');
//     }
// }

export async function getStudents(): Promise<any[]> {
    try {
        const allUsers = await getAllUsers();
        const studentsList = allUsers.filter((user: any) => user.role.name === "student");
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

// export async function getStudentsByPromotionId(promotionId: string): Promise<any[]> {
//     try {
//         const allUsers = await getAllUsers();
//         const studentsList = allUsers.filter((user: any) => user.role.name === "student" && user.promotionId === promotionId);
//         return studentsList;
//     } catch (error) {
//         console.error('Error fetching students by promotion ID:', error);
//         throw new Error('Failed to fetch students by promotion ID');
//     }
// }

export async function getRoleIdByName(roleName: string): Promise<Role> {
    try {
        const response = await apiClient.get<Role>(`${SERVICES.roles}/${roleName}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch role ID by name');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching role ID by name:', error);
        throw new Error('Failed to fetch role ID by name');
    }
}