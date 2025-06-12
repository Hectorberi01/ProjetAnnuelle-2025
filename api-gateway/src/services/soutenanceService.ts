import { SERVICES } from "../config/services.config";


const SOUTENANCES_URL = SERVICES.soutenances;

export async function generateSoutenanceSchedule(data: any): Promise<any> {
    try {
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