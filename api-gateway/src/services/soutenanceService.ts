import { SERVICES } from "../config/services.config";
import { getProjectById } from "./projectService";


const SOUTENANCES_URL = SERVICES.soutenances;

export async function generateSoutenanceSchedule(projectId: number): Promise<any> {
    try {
        const project:any = await getProjectById(projectId);

        if (!project || !Array.isArray((project as any).groups)) {
            throw new Error(
                (project && (project as any).error)
                    ? `Project fetch error: ${(project as any).error}`
                    : 'Project does not contain groups'
            );
        }

        const projectIds = (project as any).groups.map((group: any) => group.id);

        console.log('Project IDs:', projectIds);

        const startTime = new Date(project.soutenanceDate) as any;
        const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);
        const data = {
            projectId: projectId,
            groupIds: projectIds,
            mode: 'auto', 
            durationInMinutes: project.soutenanceDuration,
            startTime,
            endTime
        };

        console.log('Data to send:', data);
        
        const response = await fetch(`${SOUTENANCES_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to generate soutenance schedule');
        }

        return await response.json();
    } catch (error) {
        console.error('Error generating soutenance schedule:', error);
        throw error;
    }
}
export async function getSoutenanceSchedule(projectId: number): Promise<any> {
    try {
        const response = await fetch(`${SOUTENANCES_URL}/${projectId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch soutenance schedule');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching soutenance schedule:', error);
        throw error;
    }
}
export async function updateSoutenanceSlot(id: number, data: any): Promise<any> {
    try {
        const response = await fetch(`${SOUTENANCES_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update soutenance slot');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating soutenance slot:', error);
        throw error;
    }
}