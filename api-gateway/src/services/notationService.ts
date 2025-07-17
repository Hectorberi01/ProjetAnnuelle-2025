
import { apiClient } from '../utils/apiClient'; // ou axios directement
const URL_GRADING = process.env.SERVICES_GRADING || 'http://localhost:3005';

// --- Critères ---
export async function createCriteria(criteria: any): Promise<any> {
  const response = await apiClient.post(`${URL_GRADING}/criteria`, criteria);
  return response.data;
}

export async function getCriteriaByProject(projectId: string): Promise<any[]> {
  const response = await apiClient.get<any[]>(`${URL_GRADING}/criteria/project/${projectId}`);
  return response.data as any[];
}

export async function updateCriteria(criteriaId: string, data: any): Promise<any> {
  const response = await apiClient.put(`${URL_GRADING}/criteria/${criteriaId}`, data);
  return response.data;
}

export async function deleteCriteria(criteriaId: string): Promise<void> {
  await apiClient.delete(`${URL_GRADING}/criteria/${criteriaId}`);
}

// --- Grilles de notation ---
export async function createGradingGrid(grid: any): Promise<any> {
  const response = await apiClient.post(`${URL_GRADING}/notations`, grid);
  return response.data;
}
export async function submitGradesForGrid(gridId: string, payload: {
  groupId: string;
  studentId?: string;
  criteriaScores: {
    criteriaId: string;
    score: number;
    comment?: string;
  }[];
  globalComment?: string;
  finalScore?: number;
}): Promise<any> {
  const response = await apiClient.post(`${URL_GRADING}/grids/${gridId}/submit`, payload);
  return response.data;
}
export async function getGradingGrid(
  projectId: string,
  groupId: string,
  type: string,
  referenceId: string
): Promise<any> {
  const response = await apiClient.get(`${URL_GRADING}/notations/${projectId}/${groupId}/${type}/${referenceId}`);
  return response.data;
}

export async function updateGradingGrid(gridId: string, data: any): Promise<any> {
  const response = await apiClient.put(`${URL_GRADING}/notations/${gridId}`, data);
  return response.data;
}

export async function validateGradingGrid(gridId: string, teacherId: string): Promise<any> {
  const response = await apiClient.put(`${URL_GRADING}/notations/${gridId}/validate`, { teacherId });
  return response.data;
}

export async function getProjectGradingGrids(projectId: string): Promise<any[]> {
  const response = await apiClient.get<any[]>(`${URL_GRADING}/notations/project/${projectId}`);
  return response.data;
}

export async function getGradingGridById(gridId: string): Promise<any> {
  const response = await apiClient.get(`${URL_GRADING}/notations/${gridId}`);
  return response.data;
}
export async function calculateFinalScore(projectId: string, groupId: string): Promise<number> {
  const response = await apiClient.get(`${URL_GRADING}/scores/${projectId}/${groupId}`);
  const data = response.data as { finalScore: number };
  return data.finalScore;
}

export async function publishGrades(projectId: string): Promise<void> {
  await apiClient.put(`${URL_GRADING}/notations/${projectId}/publish`);
}

export async function getStudentGrades(studentId: string, projectId: string): Promise<any> {
  const response = await apiClient.get(`${URL_GRADING}/notations/student/${studentId}/project/${projectId}`);
  return response.data;
}

export async function getProjectGrades(projectId: string): Promise<any[]> {
  const response = await apiClient.get<any[]>(`${URL_GRADING}/notations/project/${projectId}`);
  return response.data as any[];
}
export async function updateStudentGrade(projectId: string, studentId: string, groupId: string): Promise<any> {
  const response = await apiClient.put(`${URL_GRADING}/final-score`, {
    projectId,
    studentId,
    groupId,
  });
  return response.data;
}
