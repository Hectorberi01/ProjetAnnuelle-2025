import { Project } from "../types/project";
import { apiClient } from "../utils/apiClient";
import { SERVICES } from "../config/services.config";
import { response } from "express";
import { getGroupByProjectId } from "./groupService";

const URL_PROJECTS = SERVICES.projects || "http://localhost:3002/projects";
const URL_PROMOTIONS = SERVICES.promotions || "http://localhost:3007/promotions";
const URL_GROUPS = SERVICES.groups || "http://localhost:3004/groups";

export async function createProject(projectData: any) {
    let response : any = {}
    try {
        response = await apiClient.post(`${URL_PROJECTS}`, projectData);
        console.log("response", response);
        if (response.status !== 201) {
            return response;
        }
        return response;
    } catch (error) {
        console.error('Error creating project:', error);
       return response;
    }
}

export async function getAllProjects() {
    let response : any = {}
    try {
        response = await apiClient.get(`${URL_PROJECTS}`);
        if (response.status !== 200) {
            return response;
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return response;
    }
}

export async function getProjectById(projectId: number) {
    try {
        console.log('projectId', projectId);
        // recuperer le projet par son ID
        const response = await apiClient.get<Project>(`${URL_PROJECTS}/${projectId}`);
        if (response.status !== 200) {
            return { error: "Échec de récupération du projet", status: response.status };
        }



        console.log('response', response);

        // récupérer la promotion par son ID
        const promotionId = response.data.promotionId;
        const promotionResponse = await apiClient.get(`${URL_PROMOTIONS}/${promotionId}`);
        if(promotionResponse.status !== 200) {
            return { error: "Échec de récupération de la promotion", status: promotionResponse.status };
        }

        // on récupère les groupes rattachés au projet
        const groupsResponse = await getGroupByProjectId(projectId);
        

        console.log('groupsResponse', groupsResponse);
        console.log('promotionResponse', promotionResponse);
        const result = {
            ...response.data,
            promotion: promotionResponse.data,
            groups: groupsResponse
        };

        return result;
    } catch (error) {
        return { error: "Échec de récupération du projet", status: 500 };
        //throw new Error('Failed to fetch project');
    }
}

export async function updateProject(projectId: number, projectData: any) {
    let response : any = {}
    try {
        response = await apiClient.put(`${URL_PROJECTS}/${projectId}`, projectData);
        if (response.status !== 200) {
            return response;
        }
        return response;
    } catch (error) {
        console.error('Error updating project:', error);
        return response;
    }
}

export async function deleteProject(projectId: number) {
    let response : any = {}
    try {
        response = await apiClient.delete(`${URL_PROJECTS}/${projectId}`);
        if (response.status !== 200) {
            return response;
        }
        return response;
    } catch (error) {
        console.error('Error deleting project:', error);
        return response;
    }
}

export async function getProjectsByPromotionId(promotionId: number) {
    let response : any = {}
    try {
        response = await apiClient.get(`${URL_PROJECTS}/promotion/${promotionId}`);
        if (response.status !== 200) {
            return response;
        }

        return response;
    } catch (error) {
        console.error('Error fetching projects by promotion ID:', error);
        return response;
    }
}