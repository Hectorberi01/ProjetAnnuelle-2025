import { SERVICES } from "../config/services.config";
import { apiClient } from "../utils/apiClient";
import { getProjectById } from "./projectService";
import * as env from "dotenv"
import { getUserById } from "./userService";
import { getReportByGroup } from "./reportService";
import { getDeliverablesByGroup } from "./deliverableService";
import { Project } from "../types/project";
env.config();

const URL_GROUPS = SERVICES.groups || "http://localhost:3004/groups";
const URL_PROJECTS = SERVICES.projects || "http://localhost:3002/projects";

export async function getGroupByIdWitoutEnriching(groupId: number) {
    try {
        const response = await apiClient.get(`${URL_GROUPS}/${groupId}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch group');
        }

        const groupData: any = response.data;

        // Récupère tous les étudiants associés à groupStudent
        const studentObjects = await Promise.all(
            groupData.groupStudent.map(async (gs: any) => {
                const user = await getUserById(gs.studentId);
                return {
                ...gs, // garde l'id de groupStudent
                student: user, // ajoute les données de l'étudiant
                };
            })
        );

        groupData.groupStudent = studentObjects;

        response.data = groupData;
        return response;
    } catch (error) {
        console.error('Error fetching group:', error);
        throw new Error('Failed to fetch group');
    }
}
export async function getGroupById(groupId: number) {
    try {
        const response = await apiClient.get(`${URL_GROUPS}/${groupId}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch group');
        }

        const groupData: any = response.data;

        // Récupère tous les étudiants associés à groupStudent
        const studentObjects = await Promise.all(
            groupData.groupStudent.map(async (gs: any) => {
                const user = await getUserById(gs.studentId);
                return {
                ...gs, // garde l'id de groupStudent
                student: user, // ajoute les données de l'étudiant
                };
            })
        );

        // on récupère les rapports associés à ce groupe
        const reports = await getReportByGroup(groupId);
        groupData.reports = reports;

        // on récupère les livrables associés à ce groupe
        const deliverables = await getDeliverablesByGroup(groupId);
        groupData.deliverables = deliverables;

        // Remplace groupStudent par le tableau enrichi
        groupData.groupStudent = studentObjects;
        
        response.data = groupData;
        return response;
        //return groupData;
    } catch (error) {
        console.error('Error fetching group:', error);
        throw new Error('Failed to fetch group');
    }
    
}

export async function getAllGroups() {
    try {
        const response = await apiClient.get(`${URL_GROUPS}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch groups');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw new Error('Failed to fetch groups');
    }
}

export async function getGroupByPromotionId(promotionId: string) {
    try {
        const response = await apiClient.get(`/groups/promotion/${promotionId}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch group by promotion ID');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching group by promotion ID:', error);
        throw new Error('Failed to fetch group by promotion ID');
    }
}

export async function getGroupByProjectId(projectId: number) {
    try {
        const response = await apiClient.get(`${URL_GROUPS}/project/${projectId}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch group by project ID');
        }

        // Enrichir les données de chaque groupe avec les étudiants
        const groups = response.data as any[];

        // const projectResponse = await apiClient.get<Project>(`${URL_PROJECTS}/${projectId}`);
        // if (projectResponse.status !== 200) {
        // throw new Error('Failed to fetch project');
        // }
        // const project = projectResponse.data;

        //Remplacer chaque studentId par les données de l'étudiant
        // for (const group of groups) {
        //     for (const gs of group.groupStudent) {
        //         const student = await getUserById(gs.studentId);
        //         gs.student = student;
        //         delete gs.studentId;
        //     }
        // }

        // for (const group of groups) {
        //     // Remplacer projectId par l'objet project
        //     group.project = project;
        //     delete group.projectId;

        //     // Remplacer chaque studentId par l'objet student
        //     await Promise.all(
        //         group.groupStudent.map(async (gs: any) => {
        //         const student = await getUserById(gs.studentId);
        //         gs.student = student;
        //         delete gs.studentId;
        //         })
        //     );
        // }

        return groups;
        
        //return response.data as any[];
    } catch (error) {
        console.error('Error fetching group by project ID:', error);
        throw new Error('Failed to fetch group by project ID');
    }
}

// export async function createManualGroup(groupData: any, projectId: number) {
//     try {
//         const project = await getProjectById(projectId);
//         if (project.status !== 200) {
//             throw new Error('Project not found');
//         }
//         const response = await apiClient.post(`${URL_GROUPS}/manual`, groupData);
//         if (response.status !== 201) {
//             throw new Error('Failed to create manual group');
//         }
//         return response.data;
//     } catch (error) {
//         console.error('Error creating manual group:', error);
//         throw new Error('Failed to create manual group');
//     }
// }

// export async function createFreeGroup(groupData: any, projectId: number) {
//     try {
//         const project = await getProjectById(projectId);
//         if (project.status !== 200) {
//             throw new Error('Project not found');
//         }
//         const response = await apiClient.post(`${URL_GROUPS}/free/${projectId}`, groupData);
//         if (response.status !== 201) {
//             throw new Error('Failed to create free group');
//         }
//         return response.data;
//     } catch (error) {
//         console.error('Error creating free group:', error);
//         throw new Error('Failed to create free group');
//     }
    
// }

// export async function createRandomGroup(groupData: any, projectId: number) {
//     try {
//         const project = await getProjectById(projectId);
//         if (project.status !== 200) {
//             throw new Error('Project not found');
//         }
//         const response = await apiClient.post(`${URL_GROUPS}/random/${projectId}`, groupData);
//         if (response.status !== 201) {
//             throw new Error('Failed to create random group');
//         }
//         return response.data;
//     } catch (error) {
//         console.error('Error creating random group:', error);
//         throw new Error('Failed to create random group');
//     }
// }

export async function createGroup(name: string, projectId: number) {

    console.log("Creating group with name:", name, "and projectId:", projectId);
    const payload = {
        projectId: projectId,
        name: name
    };

    console.log(URL_GROUPS)

    try {
        
        const response = await apiClient.post(`${URL_GROUPS}`, payload);

        if (response.status !== 201) {
            throw new Error('Failed to create group');
        }

        return response;

    } catch (error) {
        console.error('Error creating group:', error);
        throw new Error('Failed to create group');
    }
}

export async function updateGroup(groupId: string, groupData: any) {
    try {
        const response = await apiClient.put(`${URL_GROUPS}/${groupId}`, groupData);
        if (response.status !== 200) {
            throw new Error('Failed to update group');
        }
        return response.data;
    } catch (error) {
        console.error('Error updating group:', error);
        throw new Error('Failed to update group');
    }
}

export async function deleteGroup(groupId: string) {
    try {
        const response = await apiClient.delete(`${URL_GROUPS}/${groupId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete group');
        }
        return response.data;
    } catch (error) {
        console.error('Error deleting group:', error);
        throw new Error('Failed to delete group');
    }
}

export async function deleteGroupsByProjectId(projectId: number) {
    try {
        const response = await apiClient.delete(`${URL_GROUPS}/project/${projectId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete groups by project ID');
        }
        return response.data;
    } catch (error) {
        console.error('Error deleting groups by project ID:', error);
        throw new Error('Failed to delete groups by project ID');
    }
}

export async function JoinToGroup(groupId: number, studentId: number) {
    try {
        const data = {
            groupId: groupId,
            studentId: studentId
        }
        console.log("Adding student to group",data);
        const response = await apiClient.post(`${URL_GROUPS}/add-student`,data);

        if (response.status !== 201) {
            throw new Error('Failed to add student to group');
        }

        return response;
    } catch (error) {
        throw new Error('Failed to add student to group');
    }
}