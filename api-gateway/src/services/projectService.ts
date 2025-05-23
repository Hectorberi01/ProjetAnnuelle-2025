import { Project } from "../types/project";
import { apiClient } from "../utils/apiClient";
import { SERVICES } from "../config/services.config";
import { response } from "express";

const URL_PROJECTS = SERVICES.projects || "http://localhost:3002/api/projects";

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
        const response = await apiClient.get<Project>(`${URL_PROJECTS}/${projectId}`);
        if (response.status !== 200) {
            //throw new Error('Failed to fetch project');
            return response;
        }else{}
        return response;
    } catch (error) {
        return response;
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