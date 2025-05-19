import { SERVICES } from "../config/services.config";
import { apiClient } from "../utils/apiClient";
import { getProjectById } from "./projectService";
import * as env from "dotenv"
env.config();


export async function getGroupById(groupId: number) {
    try {
        const response = await apiClient.get(`${SERVICES.groups}/${groupId}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch group');
        }
        return response;
    } catch (error) {
        console.error('Error fetching group:', error);
        throw new Error('Failed to fetch group');
    }
    
}

export async function getAllGroups() {
    try {
        const response = await apiClient.get(`${SERVICES.groups}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch groups');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw new Error('Failed to fetch groups');
    }
}

// export async function getGroupByName(groupName: string) {   
//     try {
//         const response = await apiClient.get(`/groups/name/${groupName}`);
//         if (response.status !== 200) {
//             throw new Error('Failed to fetch group by name');
//         }
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching group by name:', error);
//         throw new Error('Failed to fetch group by name');
//     }
// }

export async function getGroupByPromotionId(promotionId: string) {
    try {
        const response = await apiClient.get(`/groups/promotion/${promotionId}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch group by promotion ID');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching group by promotion ID:', error);
        throw new Error('Failed to fetch group by promotion ID');
    }
}

export async function createManualGroup(groupData: any, projectId: number) {
    try {
        const project = await getProjectById(projectId);
        if (project.status !== 200) {
            throw new Error('Project not found');
        }
        const response = await apiClient.post(`${SERVICES.groups}/manual`, groupData);
        if (response.status !== 201) {
            throw new Error('Failed to create manual group');
        }
        return response.data;
    } catch (error) {
        console.error('Error creating manual group:', error);
        throw new Error('Failed to create manual group');
    }
}

export async function createFreeGroup(groupData: any, projectId: number) {
    try {
        const project = await getProjectById(projectId);
        if (project.status !== 200) {
            throw new Error('Project not found');
        }
        const response = await apiClient.post(`${SERVICES.groups}/free/${projectId}`, groupData);
        if (response.status !== 201) {
            throw new Error('Failed to create free group');
        }
        return response.data;
    } catch (error) {
        console.error('Error creating free group:', error);
        throw new Error('Failed to create free group');
    }
    
}

export async function createRandomGroup(groupData: any, projectId: number) {
    try {
        const project = await getProjectById(projectId);
        if (project.status !== 200) {
            throw new Error('Project not found');
        }
        const response = await apiClient.post(`${SERVICES.groups}/random/${projectId}`, groupData);
        if (response.status !== 201) {
            throw new Error('Failed to create random group');
        }
        return response.data;
    } catch (error) {
        console.error('Error creating random group:', error);
        throw new Error('Failed to create random group');
    }
}

export async function createGroup(name: string,projectId: number) {
  
    try {
        let response:any = {}
        const projectResponse = await getProjectById(projectId);

        if (projectResponse.status !== 200) {
            throw new Error('Project not found');
        }
        const project = (projectResponse as any).data;

        if (project.mode == 'manual') {
            response = await apiClient.post(`${SERVICES.groups}/${projectId}/manual`, name);
        }

        if (project.mode == 'random') {
            console.log("Creating random group",`${SERVICES.groups}/random/${projectId}`);
            const data = {
                name: name
            }
            console.log("Data",data);
            response = await apiClient.post(`${SERVICES.groups}/random/${projectId}`, data);
        }
        if (project.mode == 'free') {
            response = await apiClient.post(`${SERVICES.groups}/free/${projectId}`, name);
        }

        return response;

    } catch (error) {
        console.error('Error creating group:', error);
        throw new Error('Failed to create group');
    }
}

export async function updateGroup(groupId: string, groupData: any) {
    try {
        const response = await apiClient.put(`${SERVICES.groups}/${groupId}`, groupData);
        if (response.status !== 200) {
            throw new Error('Failed to update group');
        }
        return response.data;
    } catch (error) {
        console.error('Error updating group:', error);
        throw new Error('Failed to update group');
    }
}

export async function deleteGroup(groupId: string) {
    try {
        const response = await apiClient.delete(`${SERVICES.groups}/${groupId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete group');
        }
        return response.data;
    } catch (error) {
        console.error('Error deleting group:', error);
        throw new Error('Failed to delete group');
    }
}

export async function addStudentToGroup(groupId: number, studentId: number) {
    try {
        const data = {
            groupId: groupId,
            studentId: studentId
        }
        console.log("Adding student to group",data);
        const response = await apiClient.post(`${SERVICES.groups}/addStudent`,data);
        
        return response;
    } catch (error) {
        throw new Error('Failed to add student to group');
    }
}