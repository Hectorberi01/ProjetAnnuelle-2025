import { Project } from "../types/project";
import { apiClient } from "../utils/apiClient";
import { SERVICES } from "../config/services.config";
import { response } from "express";
import { createGroup, getGroupByProjectId, JoinToGroup } from "./groupService";
import { getReportByProject } from "./reportService";
import { getSoutenanceSchedule } from "./soutenanceService";
import { getDeliverableById, getDeliverablesByProjectId,similarityMatrix } from "./deliverableService";
import { getUserById } from "./userService";


import dotenv from "dotenv";

dotenv.config();


const URL_PROJECTS = SERVICES.projects || "http://localhost:3002/projects";
const URL_PROMOTIONS = SERVICES.promotions || "http://localhost:3007/promotions";
const URL_GROUPS = SERVICES.groups || "http://localhost:3004/groups";


export async function createProject(projectData: any ) {
    let response : any = {}
    try {
        response = await apiClient.post(`${URL_PROJECTS}`, projectData);
       
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

        // recuperer le projet par son ID
        const response = await apiClient.get<Project>(`${URL_PROJECTS}/${projectId}`);
        if (response.status !== 200) {
            return { error: "Échec de récupération du projet", status: response.status };
        }

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
         //delete groupsResponse[0].projectId;
        // 4. Enrichissement de chaque groupStudent avec l'objet student
        const enrichedGroups = await Promise.all(
            groupsResponse.map(async (group: any) => {
                const enrichedGroupStudent = await Promise.all(
                    group.groupStudent.map(async (gs: any) => {
                        const user = await getUserById(gs.studentId);
                        return {
                            ...gs,
                            student: user
                        };
                    })
                );

                return {
                    ...group,
                    groupStudent: enrichedGroupStudent
                };
            })
        );

        // on récupère les livrables du projet
        const livrablesResponse = await getDeliverablesByProjectId(projectId);

        // on écupère les rapports du projet
        const reportsResponse = await getReportByProject(projectId);
        
        // on récupère les soutenances du projet
        const soutenancesResponse = await getSoutenanceSchedule(projectId);

        // on récupère la similarité entre les livrables

        const similarity = await similarityMatrix(projectId)

        const result = {
            ...response.data,
            promotion: promotion,
            groups: enrichedGroups,
            reports: reportsResponse,
            livrables: livrablesResponse,
            soutenances: soutenancesResponse,
            similarity: similarity
        };

        return result;
    } catch (error) {
        return { error: "Échec de récupération du projet", status: 500 };
        //throw new Error('Failed to fetch project');
    }
}

export async function updateProject(projectId: number, projectData: any) {
    console.log('dans le servcie ');
    let response : any = {}
    try {
        console.log("dans updateProject", projectData);
        response = await apiClient.put(`${URL_PROJECTS}/update/${projectId}`, projectData);
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

export async function getProjectsByPromotionId(promotionId: number): Promise<any[]> {

    try {
        const response = await apiClient.get(`${URL_PROJECTS}/promotion/${promotionId}`);
        if (response.status !== 200) {
            return [];
        }

        return response.data as any[];
    } catch (error) {
        console.error('Error fetching projects by promotion ID:', error);
        return [];
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

export function getPublicPDFUrl(filename: string): string {
    return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${encodeURIComponent(filename)}`;
}