
// http://users:3005/api/reports

import { SERVICES } from "../config/services.config";
import { apiClient } from "../utils/apiClient";

export async function getAllReports(): Promise<any[]> {
    try {
        const response = await apiClient.get<any[]>(`${SERVICES.reports}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch reports');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw new Error('Failed to fetch reports');
    }
}

export async function createReport(report: any): Promise<any> {
    try {
        const response = await apiClient.post<any>(`${SERVICES.reports}`, report);
        if (response.status !== 201) {
            throw new Error('Failed to create report');
        }
        return response.data;
    } catch (error) {
        console.error('Error creating report:', error);
        throw new Error('Failed to create report');
    }
    
}

export async function getReportByProject(projectId: number): Promise<any[]> {
    try {
        const response = await apiClient.get<any[]>(`${SERVICES.reports}/projects/${projectId}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch reports');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw new Error('Failed to fetch reports');
    }
}

export async function getReportById(reportId: number): Promise<any> {
    try {
        const response = await apiClient.get<any>(`${SERVICES.reports}/${reportId}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch report');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching report:', error);
        throw new Error('Failed to fetch report');
    }
}

export async function updateReport(reportId: number, report: any): Promise<any> {
    try {
        const response = await apiClient.put<any>(`${SERVICES.reports}/${reportId}`, report);
        if (response.status !== 200) {
            throw new Error('Failed to update report');
        }
        return response.data;
    } catch (error) {
        console.error('Error updating report:', error);
        throw new Error('Failed to update report');
    }
}
export async function deleteReport(reportId: number): Promise<any> {
    try {
        const response = await apiClient.delete<any>(`${SERVICES.reports}/${reportId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete report');
        }
        return response.data;
    } catch (error) {
        console.error('Error deleting report:', error);
        throw new Error('Failed to delete report');
    }
}