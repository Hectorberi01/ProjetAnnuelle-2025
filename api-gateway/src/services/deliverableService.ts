import { SERVICES } from "../config/services.config";
import FormData from 'form-data';
const fetch = require('node-fetch');

const DELIVERABLES_URL  = SERVICES.deliverables || "http://localhost:3009/deliverables";
interface submitDeliverableFormData {
    name: string;
    description: string;
    githubUrl?: string;
    groupId: number;
    projectId: number;
    file: Express.Multer.File;
    
}
export async function getAllDeliverables(): Promise<any[]> {
    try {
        const response = await fetch(`${DELIVERABLES_URL}`);
        if (!response.ok) {
            throw new Error('Failed to fetch deliverables');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching deliverables:', error);
        throw new Error('Failed to fetch deliverables');
    }
}

export async function getDeliverableById(deliverableId: number): Promise<any> {
    try {
        const response = await fetch(`${DELIVERABLES_URL}/${deliverableId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch deliverable with ID ${deliverableId}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching deliverable with ID ${deliverableId}:`, error);
        throw new Error(`Failed to fetch deliverable with ID ${deliverableId}`);
    }
}

export async function getDeliverablesByGroup(groupId: number): Promise<any[]> {
    try {
        const response = await fetch(`${DELIVERABLES_URL}/groups/${groupId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch deliverables for group ID ${groupId}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching deliverables for group ID ${groupId}:`, error);
        throw new Error(`Failed to fetch deliverables for group ID ${groupId}`);
    }
}

export async function getDeliverablesByProjectId(projectId: number): Promise<any[]> {
    try {
        console.log(`Fetching deliverables URL: ${DELIVERABLES_URL}/project/${projectId}`);
        const response = await fetch(`${DELIVERABLES_URL}/project/${projectId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch deliverables for project ID ${projectId}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching deliverables for project ID ${projectId}:`, error);
        throw new Error(`Failed to fetch deliverables for project ID ${projectId}`);
    }
}


export async function submitDeliverable(formData: any): Promise<any> {

    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    if (formData.githubUrl) {
        form.append('githubUrl', formData.githubUrl);
    }
    form.append('groupId', formData.groupId.toString());
    form.append('projectId', formData.projectId.toString());
    form.append('fileUrl', formData.fileUrl);
    try {
        const response = await fetch(`${DELIVERABLES_URL}`, {
            method: 'POST',
            body: form
        });

        const text = await response.text(); // pour voir le contenu brut
        console.log('Status:', response.status);
        console.log('Response body:', text);
        if (!response.ok) {
            throw new Error('Failed to submit deliverable');
        }
        return await response.json();
    } catch (error) {
        console.error('Error submitting deliverable:', error);
        throw new Error('Failed to submit deliverable');
    }
}


export async function downloadDeliverable(deliverableId: number): Promise<Buffer> {
    try {
        const response = await fetch(`${DELIVERABLES_URL}/${deliverableId}/download`);
        if (!response.ok) {
            throw new Error(`Failed to download deliverable with ID ${deliverableId}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
        //return await response.blob();
    } catch (error) {
        console.error(`Error downloading deliverable with ID ${deliverableId}:`, error);
        throw new Error(`Failed to download deliverable with ID ${deliverableId}`);
    }
}

export async function similarityCheck(projectId: number): Promise<any> {
    try {
        const response = await fetch(`${DELIVERABLES_URL}/internal/similarity-check/project/${projectId}`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error(`Failed to perform similarity check for project ID ${projectId}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error performing similarity check for project ID ${projectId}:`, error);
        throw new Error(`Failed to perform similarity check for project ID ${projectId}`);
    }
}
export async function similarityMatrix(projectId: number): Promise<any> {
    try {
        const response = await fetch(`${DELIVERABLES_URL}/projects/${projectId}/similarity-matrix`);
        if (!response.ok) {
            throw new Error(`Failed to fetch similarity matrix for project ID ${projectId}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching similarity matrix for project ID ${projectId}:`, error);
        throw new Error(`Failed to fetch similarity matrix for project ID ${projectId}`);
    }
}
