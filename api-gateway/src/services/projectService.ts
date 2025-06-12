import { Project } from "../types/project";
import { apiClient } from "../utils/apiClient";
import { SERVICES } from "../config/services.config";
import { response } from "express";
import { getGroupByProjectId } from "./groupService";
import { getReportByProject } from "./reportService";
import { getSoutenanceSchedule } from "./soutenanceService";
import { getDeliverableById, getDeliverablesByProjectId } from "./deliverableService";

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
        const data = response.data;

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
        const promotion = promotionResponse.data as { [key: string]: any };

        delete promotion.promotionStudents; // on supprime les étudiants de la promotion pour ne pas les renvoyer dans le projet

        // on récupère les groupes rattachés au projet
        const groupsResponse = await getGroupByProjectId(projectId);

        console.log('groupsResponse', groupsResponse);

        // on récupère les livrables du projet
        const livrablesResponse = await getDeliverablesByProjectId(projectId);

        // on écupère les rapports du projet
        const reportsResponse = await getReportByProject(projectId);
        
        // on récupère les soutenances du projet
        const soutenancesResponse = await getSoutenanceSchedule(projectId);

        const result = {
            ...response.data,
            promotion: promotion,
            groups: groupsResponse,
            reports: reportsResponse,
            livrables: livrablesResponse,
            soutenances: soutenancesResponse
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
    
    console.log('URL',`${URL_PROJECTS}/promotion/${promotionId}`);
    try {
        const response = await apiClient.get(`${URL_PROJECTS}/promotion/${promotionId}`);
        console.log('response', response);
        if (response.status !== 200) {
            return response;
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching projects by promotion ID:', error);
        return response;
    }
}

export async function addSoutenanceInfo(projectId: number, soutenanceData: any) {
    let response : any = {}
    try {
        response = await apiClient.post(`${URL_PROJECTS}/${projectId}/soutenance`, soutenanceData);
        if (response.status !== 200) {
            return response;
        }
        return response.data;
    } catch (error) {
        console.error('Error adding soutenance info:', error);
        return response;
    }
}
export async function updateSoutenanceInfo(projectId: number, soutenanceData: any) {
    let response : any = {}
    try {
        response = await apiClient.put(`${URL_PROJECTS}/${projectId}/soutenance`, soutenanceData);
        if (response.status !== 200) {
            return response;
        }
        return response.data;
    } catch (error) {
        console.error('Error updating soutenance info:', error);
        return response;
    }
}