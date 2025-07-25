
import { SERVICES } from '../config/services.config';
import { apiClient } from '../utils/apiClient'; // ou axios directement
const URL_GRADING = SERVICES.notations || 'http://localhost:3005/notations';

// --- Critères ---


export async function getGradingCriteria(projectId: string): Promise<any[]> {
  const response = await apiClient.get<any[]>(`${URL_GRADING}/${projectId}/grilles`);
  return response.data as any[];
}




export async function addGradingCriteria(projectId: string, criteria: any): Promise<any> {
  const response = await apiClient.post(`${URL_GRADING}/${projectId}/grilles`, criteria);
  return response.data;
}



export async function validateSpecificGrille(projectId: string, groupId: string, grilleId: string): Promise<any> {
  const response = await apiClient.post(`${URL_GRADING}/${projectId}/groups/${groupId}/notation/grilles/${grilleId}/validate`);
  return response.data;
}


export async function getGrillesCritere(projectId: string, groupId: string): Promise<any[]> {
  const response = await apiClient.get<any[]>(`${URL_GRADING}/${projectId}/groups/${groupId}/grilles/criteres`);
  return response.data as any[];
}

export async function createGrille(projectId: string, groupId: string, data: any): Promise<any> {
  const response = await apiClient.post(`${URL_GRADING}/${projectId}/groups/${groupId}/criteres`, data);
  return response.data;
}


export async function publishProjectGrades(projectId: string): Promise<any> {
  const response = await apiClient.post(`${URL_GRADING}/${projectId}/publish`);
  return response.data;
}

export async function updateGradingCriteria(grilleId: string, data: any): Promise<any> {
  const response = await apiClient.put(`${URL_GRADING}/grilles/${grilleId}`, data);
  return response.data;
}

export async function updateCritere(grilleId: string, critereId: number, data: any): Promise<any> {
  const response = await apiClient.put(`${URL_GRADING}/${grilleId}/criteres/${critereId}`, data);
  return response.data;
}
export async function deleteCriteria(grilleId: string, critereId: string): Promise<void> {
  await apiClient.delete(`${URL_GRADING}/${grilleId}/criteres/${critereId}`);
  
}
export async function deleteGradingCriteria( grilleId: string): Promise<void> {
  await apiClient.delete(`${URL_GRADING}/grilles/${grilleId}`);
}

export async function updateCritereNote(projectId: string, groupId: string, data: any): Promise<any> {
  const response = await apiClient.put(`${URL_GRADING}/${projectId}/groups/${groupId}/notation/critere`, data);
  return response.data;
}

export async function validateGradingGrid(grilleId: string): Promise<any> {
  const response = await apiClient.post(`${URL_GRADING}/grilles/${grilleId}/validate`);
  return response.data;
}
export async function getGradingGridByProjectAndGroup(projectId: string, groupId: string): Promise<any> {
  const response = await apiClient.get(`${URL_GRADING}/${projectId}/groups/${groupId}/notation`);
  return response.data;
}
export async function saveCritereNote(projectId: string, groupId: string, data: any): Promise<any> {
  const response = await apiClient.post(`${URL_GRADING}/${projectId}/groups/${groupId}/notation/critere`, data);
  return response.data;
}
export async function saveGlobalComment(projectId: string, groupId: string, data: any): Promise<any> {
  const response = await apiClient.post(`${URL_GRADING}/${projectId}/groups/${groupId}/notation/commentaire-global`, data);
  return response.data;
}
export async function finalizeGroupNotation(projectId: string, groupId: string, data: any, userId: string): Promise<any> {
  const response = await apiClient.post(`${URL_GRADING}/${projectId}/groups/${groupId}/notation/finalize`, data, {
    headers: { 'user-id': userId }
  });
  return response.data;
}
export async function getGradingGridById(grilleId: string): Promise<any> {
  const response = await apiClient.get(`${URL_GRADING}/grilles/${grilleId}`);
  return response.data;
}

export async function getRecap(projectId: string, groupId: string): Promise<any> {
  const response = await apiClient.get(`${URL_GRADING}/projects/${projectId}/groups/${groupId}/recap`);
  return response.data;
}

export async function saveNotation(data: any): Promise<any>  {
  try {
    const response = await apiClient.post(`${URL_GRADING}/`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la notation:", error);
    throw error;
  }
}