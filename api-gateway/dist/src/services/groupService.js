"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupByIdWitoutEnriching = getGroupByIdWitoutEnriching;
exports.getGroupById = getGroupById;
exports.getAllGroups = getAllGroups;
exports.getGroupByPromotionId = getGroupByPromotionId;
exports.getGroupByProjectId = getGroupByProjectId;
exports.createGroup = createGroup;
exports.updateGroup = updateGroup;
exports.deleteGroup = deleteGroup;
exports.deleteGroupsByProjectId = deleteGroupsByProjectId;
exports.JoinToGroup = JoinToGroup;
const services_config_1 = require("../config/services.config");
const apiClient_1 = require("../utils/apiClient");
const env = __importStar(require("dotenv"));
const userService_1 = require("./userService");
const reportService_1 = require("./reportService");
const deliverableService_1 = require("./deliverableService");
env.config();
const URL_GROUPS = services_config_1.SERVICES.groups || "http://localhost:3004/groups";
const URL_PROJECTS = services_config_1.SERVICES.projects || "http://localhost:3002/projects";
function getGroupByIdWitoutEnriching(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_GROUPS}/${groupId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch group');
            }
            const groupData = response.data;
            // Récupère tous les étudiants associés à groupStudent
            const studentObjects = yield Promise.all(groupData.groupStudent.map((gs) => __awaiter(this, void 0, void 0, function* () {
                const user = yield (0, userService_1.getUserById)(gs.studentId);
                return Object.assign(Object.assign({}, gs), { student: user });
            })));
            groupData.groupStudent = studentObjects;
            response.data = groupData;
            return response;
        }
        catch (error) {
            console.error('Error fetching group:', error);
            throw new Error('Failed to fetch group');
        }
    });
}
function getGroupById(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_GROUPS}/${groupId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch group');
            }
            const groupData = response.data;
            // Récupère tous les étudiants associés à groupStudent
            const studentObjects = yield Promise.all(groupData.groupStudent.map((gs) => __awaiter(this, void 0, void 0, function* () {
                const user = yield (0, userService_1.getUserById)(gs.studentId);
                return Object.assign(Object.assign({}, gs), { student: user });
            })));
            // on récupère les rapports associés à ce groupe
            const reports = yield (0, reportService_1.getReportByGroup)(groupId);
            groupData.reports = reports;
            // on récupère les livrables associés à ce groupe
            const deliverables = yield (0, deliverableService_1.getDeliverablesByGroup)(groupId);
            groupData.deliverables = deliverables;
            // Remplace groupStudent par le tableau enrichi
            groupData.groupStudent = studentObjects;
            response.data = groupData;
            return response;
            //return groupData;
        }
        catch (error) {
            console.error('Error fetching group:', error);
            throw new Error('Failed to fetch group');
        }
    });
}
function getAllGroups() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_GROUPS}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch groups');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching groups:', error);
            throw new Error('Failed to fetch groups');
        }
    });
}
function getGroupByPromotionId(promotionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`/groups/promotion/${promotionId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch group by promotion ID');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching group by promotion ID:', error);
            throw new Error('Failed to fetch group by promotion ID');
        }
    });
}
function getGroupByProjectId(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_GROUPS}/project/${projectId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch group by project ID');
            }
            // Enrichir les données de chaque groupe avec les étudiants
            const groups = response.data;
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
        }
        catch (error) {
            console.error('Error fetching group by project ID:', error);
            throw new Error('Failed to fetch group by project ID');
        }
    });
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
function createGroup(name, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Creating group with name:", name, "and projectId:", projectId);
        const payload = {
            projectId: projectId,
            name: name
        };
        console.log(URL_GROUPS);
        try {
            const response = yield apiClient_1.apiClient.post(`${URL_GROUPS}`, payload);
            if (response.status !== 201) {
                throw new Error('Failed to create group');
            }
            return response;
        }
        catch (error) {
            console.error('Error creating group:', error);
            throw new Error('Failed to create group');
        }
    });
}
function updateGroup(groupId, groupData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.put(`${URL_GROUPS}/${groupId}`, groupData);
            if (response.status !== 200) {
                throw new Error('Failed to update group');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error updating group:', error);
            throw new Error('Failed to update group');
        }
    });
}
function deleteGroup(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.delete(`${URL_GROUPS}/${groupId}`);
            if (response.status !== 200) {
                throw new Error('Failed to delete group');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error deleting group:', error);
            throw new Error('Failed to delete group');
        }
    });
}
function deleteGroupsByProjectId(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.delete(`${URL_GROUPS}/project/${projectId}`);
            if (response.status !== 200) {
                throw new Error('Failed to delete groups by project ID');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error deleting groups by project ID:', error);
            throw new Error('Failed to delete groups by project ID');
        }
    });
}
function JoinToGroup(groupId, studentId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = {
                groupId: groupId,
                studentId: studentId
            };
            console.log("Adding student to group", data);
            const response = yield apiClient_1.apiClient.post(`${URL_GROUPS}/add-student`, data);
            if (response.status !== 201) {
                throw new Error('Failed to add student to group');
            }
            return response;
        }
        catch (error) {
            throw new Error('Failed to add student to group');
        }
    });
}
