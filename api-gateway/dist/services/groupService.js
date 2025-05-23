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
exports.getGroupById = getGroupById;
exports.getAllGroups = getAllGroups;
exports.getGroupByPromotionId = getGroupByPromotionId;
exports.createManualGroup = createManualGroup;
exports.createFreeGroup = createFreeGroup;
exports.createRandomGroup = createRandomGroup;
exports.createGroup = createGroup;
exports.updateGroup = updateGroup;
exports.deleteGroup = deleteGroup;
exports.addStudentToGroup = addStudentToGroup;
const services_config_1 = require("../config/services.config");
const apiClient_1 = require("../utils/apiClient");
const projectService_1 = require("./projectService");
const env = __importStar(require("dotenv"));
env.config();
const URL_GROUPS = services_config_1.SERVICES.groups || "http://localhost:3004/api/groups";
function getGroupById(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_GROUPS}/${groupId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch group');
            }
            return response;
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
// export async function getGroupByName(groupName: string) {   
//     try {
//         const response = await apiClient.get(`/groups/name/${groupName}`);
//         if (response.status !== 200) {
//             throw new Error('Failed to fetch group by name');
//         }
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching group by name:', error);
//         throw new Error('Failed to fetch group by name');
//     }
// }
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
function createManualGroup(groupData, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield (0, projectService_1.getProjectById)(projectId);
            if (project.status !== 200) {
                throw new Error('Project not found');
            }
            const response = yield apiClient_1.apiClient.post(`${URL_GROUPS}/manual`, groupData);
            if (response.status !== 201) {
                throw new Error('Failed to create manual group');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error creating manual group:', error);
            throw new Error('Failed to create manual group');
        }
    });
}
function createFreeGroup(groupData, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield (0, projectService_1.getProjectById)(projectId);
            if (project.status !== 200) {
                throw new Error('Project not found');
            }
            const response = yield apiClient_1.apiClient.post(`${URL_GROUPS}/free/${projectId}`, groupData);
            if (response.status !== 201) {
                throw new Error('Failed to create free group');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error creating free group:', error);
            throw new Error('Failed to create free group');
        }
    });
}
function createRandomGroup(groupData, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield (0, projectService_1.getProjectById)(projectId);
            if (project.status !== 200) {
                throw new Error('Project not found');
            }
            const response = yield apiClient_1.apiClient.post(`${URL_GROUPS}/random/${projectId}`, groupData);
            if (response.status !== 201) {
                throw new Error('Failed to create random group');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error creating random group:', error);
            throw new Error('Failed to create random group');
        }
    });
}
function createGroup(name, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let response = {};
            const projectResponse = yield (0, projectService_1.getProjectById)(projectId);
            if (projectResponse.status !== 200) {
                throw new Error('Project not found');
            }
            const project = projectResponse.data;
            if (project.mode == 'manual') {
                response = yield apiClient_1.apiClient.post(`${URL_GROUPS}/${projectId}/manual`, name);
            }
            if (project.mode == 'random') {
                console.log("Creating random group", `${URL_GROUPS}/random/${projectId}`);
                const data = {
                    name: name
                };
                console.log("Data", data);
                response = yield apiClient_1.apiClient.post(`${URL_GROUPS}/random/${projectId}`, data);
            }
            if (project.mode == 'free') {
                response = yield apiClient_1.apiClient.post(`${URL_GROUPS}/free/${projectId}`, name);
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
function addStudentToGroup(groupId, studentId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = {
                groupId: groupId,
                studentId: studentId
            };
            console.log("Adding student to group", data);
            const response = yield apiClient_1.apiClient.post(`${URL_GROUPS}/addStudent`, data);
            return response;
        }
        catch (error) {
            throw new Error('Failed to add student to group');
        }
    });
}
