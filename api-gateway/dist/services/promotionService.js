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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSV = parseCSV;
exports.createPromotion = createPromotion;
exports.addStudentToPromotion = addStudentToPromotion;
exports.getPromotionById = getPromotionById;
exports.getAllPromotions = getAllPromotions;
exports.updatePromotion = updatePromotion;
exports.deletePromotion = deletePromotion;
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const apiClient_1 = require("../utils/apiClient");
const userService_1 = require("./userService");
const env = __importStar(require("dotenv"));
const services_config_1 = require("../config/services.config");
env.config();
const URL_PROMOTIONS = services_config_1.SERVICES.promotions || "http://localhost:3007/promotions";
const URL_PROJECTS = services_config_1.SERVICES.projects || "http://localhost:3002/projects";
function parseCSV(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const results = [];
            const stream = stream_1.Readable.from(file.buffer.toString("latin1"));
            stream
                .pipe((0, csv_parser_1.default)({ separator: ";" }))
                .on("data", (data) => results.push(data))
                .on("end", () => resolve(results))
                .on("error", reject);
        });
    });
}
function createPromotion(promotion, file) {
    return __awaiter(this, void 0, void 0, function* () {
        let students = [];
        if (!file) {
            throw new Error("File is required");
        }
        try {
            if (file.mimetype === "application/json") {
                const fileContent = file.buffer.toString("utf-8");
                students = JSON.parse(fileContent);
            }
            else {
                students = yield parseCSV(file);
            }
        }
        catch (err) {
            console.error("Erreur pendant la lecture du fichier : ", err);
            throw new Error("Impossible de lire le fichier étudiants");
        }
        // récupère l'id du role étudiant
        const role = yield (0, userService_1.getRoleIdByName)("student");
        const roleId = role.id;
        try {
            const linkedUsers = [];
            //on fait appel au service utiliateur pour créer l'utilisateur
            for (const student of students) {
                const response = yield (0, userService_1.getUserByEmail)(student.email);
                let user;
                if (response !== null) {
                    user = response;
                }
                else {
                    student.roleId = roleId;
                    const createResponse = yield (0, userService_1.createUser)(student);
                    if (!createResponse) {
                        throw new Error("Failed to create user");
                    }
                    user = createResponse;
                }
                linkedUsers.push(user.id);
            }
            const response = yield apiClient_1.apiClient.post(`${URL_PROMOTIONS}`, promotion);
            if (response.status !== 201) {
                throw new Error("Failed to create promotion");
            }
            // On récupère la promotion
            const promo = response.data;
            console.log("linkedUsers", linkedUsers);
            console.log("promo", promo);
            // On ajoute les étudiants à la promotion
            for (const studentId of linkedUsers) {
                const etudentResponse = yield addStudentToPromotion(promo.id, studentId);
                console.log("etudentResponse", etudentResponse);
            }
            return promo;
        }
        catch (error) {
            throw new Error("Failed to create promotion");
        }
    });
}
//     // Add a student to a promotion
function addStudentToPromotion(promotionId, studentId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`${URL_PROMOTIONS}/${promotionId}/students`);
        try {
            const response = yield apiClient_1.apiClient.post(`${URL_PROMOTIONS}/${promotionId}/students`, { studentId });
            if (response.status !== 201) {
                throw new Error('Failed to add student to promotion');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error adding student to promotion:', error);
            throw new Error('Failed to add student to promotion');
        }
    });
}
function getPromotionById(promotionId) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        try {
            response = yield apiClient_1.apiClient.get(`${URL_PROMOTIONS}/${promotionId}`);
            if (response.status !== 200) {
                return response;
            }
            return response;
        }
        catch (error) {
            return response;
        }
    });
}
function getAllPromotions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("SERVICES.promotions", URL_PROMOTIONS);
            const response = yield apiClient_1.apiClient.get(`${URL_PROMOTIONS}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch promotions');
            }
            // on récupère les étudiants de la promotion
            const students = yield (0, userService_1.getStudents)();
            // on récupère le nombre de projets de chaque promotion
            const projects = yield apiClient_1.apiClient.get(`${URL_PROJECTS}`);
            if (projects.status !== 200) {
                throw new Error('Failed to fetch projects');
            }
            const projectList = projects.data.projects;
            if (!Array.isArray(projectList)) {
                throw new Error('Projects is not an array');
            }
            console.log("data", projectList);
            // Regroupement des projets par ID de promotion
            const projectsByPromotionId = projectList.reduce((acc, project) => {
                if (!acc[project.promotionId]) {
                    acc[project.promotionId] = 0;
                }
                acc[project.promotionId]++;
                return acc;
            }, {});
            // Enrichir les promotions avec les étudiants et le nombre de projets
            const promotionsWithStudents = response.data.map(promotion => {
                var _a;
                const studentList = ((_a = promotion.promotionStudents) === null || _a === void 0 ? void 0 : _a.map((ps) => {
                    return students.find(student => student.id === ps.studentId);
                }).filter(Boolean)) || [];
                return Object.assign(Object.assign({}, promotion), { students: studentList, numberOfProjects: projectsByPromotionId[promotion.id] || 0, promotionStudents: undefined // Nettoyage éventuel
                 });
            });
            return promotionsWithStudents;
        }
        catch (error) {
            console.error('Error fetching promotions:', error);
            throw new Error('Failed to fetch promotions');
        }
    });
}
function updatePromotion(promotionId, promotionData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.put(`${URL_PROMOTIONS}/${promotionId}`, promotionData);
            if (response.status !== 200) {
                throw new Error('Failed to update promotion');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error updating promotion:', error);
            throw new Error('Failed to update promotion');
        }
    });
}
function deletePromotion(promotionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.delete(`${URL_PROMOTIONS}/${promotionId}`);
            if (response.status !== 200) {
                throw new Error('Failed to delete promotion');
            }
            return response.data;
        }
        catch (error) {
            console.error('Error deleting promotion:', error);
            throw new Error('Failed to delete promotion');
        }
    });
}
// export async function getPromotionByName(promotionName: string): Promise<any> {
//     try {
//         const response = await apiClient.get(`${SERVICES.promotions}/name/${promotionName}`);
//         if (response.status !== 200) {
//             throw new Error('Failed to fetch promotion by name');
//         }
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching promotion by name:', error);
//         throw new Error('Failed to fetch promotion by name');
//     }
// }
