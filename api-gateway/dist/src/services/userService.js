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
exports.getUserById = getUserById;
exports.getAllUsers = getAllUsers;
exports.getUserByEmail = getUserByEmail;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getStudents = getStudents;
exports.getTeachers = getTeachers;
exports.getAdmins = getAdmins;
exports.getRoleIdByName = getRoleIdByName;
const services_config_1 = require("../config/services.config");
const apiClient_1 = require("../utils/apiClient");
const env = __importStar(require("dotenv"));
env.config();
const URL_USERS = services_config_1.SERVICES.users || "http://localhost:3003/users";
const URL_ROLES = services_config_1.SERVICES.roles || "http://localhost:3003/roles";
const URL_AUTH = services_config_1.SERVICES.auth || "http://localhost:3001/auth";
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_USERS}/${userId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch user');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Failed to fetch user');
        }
    });
}
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`${URL_USERS}`);
            const response = yield apiClient_1.apiClient.get(`${URL_USERS}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch users');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users');
        }
    });
}
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield apiClient_1.apiClient.get(`${URL_USERS}/email/${email}`);
            if (user.status !== 200) {
                return null;
            }
            return user.data;
        }
        catch (error) {
            return null;
        }
    });
}
function createUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.post(`${URL_USERS}`, userData);
            if (response.status !== 201) {
                throw new Error('Failed to create user');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    });
}
function updateUser(userId, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.put(`${URL_USERS}/${userId}`, userData);
            if (response.status !== 200) {
                throw new Error('Failed to update user');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    });
}
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.delete(`${URL_USERS}/${userId}`);
            if (response.status !== 200) {
                throw new Error('Failed to delete user');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    });
}
function getStudents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allUsers = yield getAllUsers();
            const studentsList = allUsers.filter((user) => user.role.name === "STUDENT");
            console.log('Fetched students:', studentsList);
            return studentsList;
        }
        catch (error) {
            console.error('Error fetching students:', error);
            throw new Error('Failed to fetch students');
        }
    });
}
function getTeachers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allUsers = yield getAllUsers();
            const teachersList = allUsers.filter((user) => user.role.name === "teacher");
            return teachersList;
        }
        catch (error) {
            console.error('Error fetching teachers:', error);
            throw new Error('Failed to fetch teachers');
        }
    });
}
function getAdmins() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allUsers = yield getAllUsers();
            const adminsList = allUsers.filter((user) => user.role.name === "admin");
            return adminsList;
        }
        catch (error) {
            console.error('Error fetching admins:', error);
            throw new Error('Failed to fetch admins');
        }
    });
}
function getRoleIdByName(roleName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_ROLES}/${roleName}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch role ID by name');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching role ID by name:', error);
            throw new Error('Failed to fetch role ID by name');
        }
    });
}
