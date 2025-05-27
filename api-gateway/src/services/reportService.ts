
// http://users:3005/api/reports

import { SERVICES } from "../config/services.config";
import { apiClient } from "../utils/apiClient";

const URL_REPORTS = SERVICES.reports || "http://localhost:3005/reports";

export async function getAllReports(): Promise<any[]> {
    try {
        const response = await apiClient.get<any[]>(`${URL_REPORTS}`);
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
        const response = await apiClient.post<any>(`${URL_REPORTS}`, report);
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
        const response = await apiClient.get<any[]>(`${URL_REPORTS}/projects/${projectId}`);
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
        const response = await apiClient.get<any>(`${URL_REPORTS}/${reportId}`);
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
        const response = await apiClient.put<any>(`${URL_REPORTS}/${reportId}`, report);
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
        const response = await apiClient.delete<any>(`${URL_REPORTS}/${reportId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete report');
        }
        return response.data;
    } catch (error) {
        console.error('Error deleting report:', error);
        throw new Error('Failed to delete report');
    }
}