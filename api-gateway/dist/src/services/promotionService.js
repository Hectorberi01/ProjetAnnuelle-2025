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
exports.addStudentUsingCSV = addStudentUsingCSV;
exports.addStudentToPromotion = addStudentToPromotion;
exports.getPromotionById = getPromotionById;
exports.getPromotionByStudentId = getPromotionByStudentId;
exports.getAllPromotions = getAllPromotions;
exports.getAll = getAll;
exports.updatePromotion = updatePromotion;
exports.deletePromotion = deletePromotion;
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const apiClient_1 = require("../utils/apiClient");
const userService_1 = require("./userService");
const env = __importStar(require("dotenv"));
const services_config_1 = require("../config/services.config");
const notificationService_1 = require("./notificationService");
const projectService_1 = require("./projectService");
const groupService_1 = require("./groupService");
env.config();
const URL_PROMOTIONS = services_config_1.SERVICES.promotions || "http://localhost:3007/promotions";
const URL_PROJECTS = services_config_1.SERVICES.projects || "http://localhost:3002/projects";
const URL_USERS = services_config_1.SERVICES.users || "http://localhost:3003/users";
const URL_GROUPS = services_config_1.SERVICES.groups || "http://localhost:3004/groups";
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
        if (!file)
            throw new Error("File is required");
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
            throw new Error("Impossible de lire le fichier étudiants");
        }
        // récupère l'id du role étudiant
        const role = yield (0, userService_1.getRoleIdByName)("student");
        const roleId = role.id;
        const linkedUsers = [];
        const existStudents = [];
        const newStudents = [];
        try {
            for (const student of students) {
                const response = yield (0, userService_1.getUserByEmail)(student.email);
                let user;
                if (response !== null) {
                    user = response;
                    existStudents.push(user);
                }
                else {
                    student.roleId = roleId;
                    const createResponse = yield (0, userService_1.createUser)(student);
                    if (!createResponse) {
                        throw new Error("Failed to create user");
                    }
                    newStudents.push(createResponse);
                    user = createResponse;
                }
                linkedUsers.push(user.id);
            }
            const response = yield apiClient_1.apiClient.post(`${URL_PROMOTIONS}`, promotion);
            if (response.status !== 201)
                throw new Error("Failed to create promotion");
            // On récupère la promotion
            const promo = response.data;
            // On ajoute les étudiants à la promotion
            for (const studentId of linkedUsers) {
                yield addStudentToPromotion(promo.id, studentId);
            }
            yield Promise.all(newStudents.map((student) => __awaiter(this, void 0, void 0, function* () {
                yield (0, notificationService_1.sendAccountCredentialsEmail)(student.email, student.username);
                yield (0, notificationService_1.sendPromotionEnrollmentEmail)(student.email, promo.name);
            })));
            yield Promise.all(existStudents.map((student) => __awaiter(this, void 0, void 0, function* () {
                yield (0, notificationService_1.sendPromotionEnrollmentEmail)(student.email, promo.name);
            })));
            return promo;
        }
        catch (error) {
            throw new Error("Failed to create promotion");
        }
    });
}
function addStudentUsingCSV(promotionId, file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file)
            throw new Error("File is required");
        let students = [];
        const existStudents = [];
        const newStudents = [];
        const linkedUsers = [];
        try {
            const promoRes = yield apiClient_1.apiClient.get(`${URL_PROMOTIONS}/${promotionId}`);
            if (promoRes.status !== 200)
                throw new Error("Failed to fetch promotion");
            const promo = promoRes.data;
            if (file.mimetype === "application/json") {
                const fileContent = file.buffer.toString("utf-8");
                students = JSON.parse(fileContent);
            }
            else {
                students = yield parseCSV(file);
            }
            const role = yield (0, userService_1.getRoleIdByName)("student".toUpperCase());
            for (const student of students) {
                const response = yield (0, userService_1.getUserByEmail)(student.email);
                let user;
                if (response !== null) {
                    user = response;
                    existStudents.push(user);
                }
                else {
                    student.roleId = role.id;
                    const createResponse = yield (0, userService_1.createUser)(student);
                    if (!createResponse) {
                        throw new Error("Failed to create user");
                    }
                    newStudents.push(createResponse);
                    user = createResponse;
                }
                linkedUsers.push(user.id);
            }
            for (const studentId of linkedUsers) {
                yield addStudentToPromotion(promotionId, studentId);
            }
            yield Promise.all(newStudents.map((student) => __awaiter(this, void 0, void 0, function* () {
                yield (0, notificationService_1.sendAccountCredentialsEmail)(student.email, student.username);
                yield (0, notificationService_1.sendPromotionEnrollmentEmail)(student.email, promo.name);
            })));
            yield Promise.all(existStudents.map((student) => __awaiter(this, void 0, void 0, function* () {
                yield (0, notificationService_1.sendPromotionEnrollmentEmail)(student.email, promo.name);
            })));
        }
        catch (error) {
            throw new Error("Failed to parse CSV");
        }
        const promises = students.map(student => addStudentToPromotion(promotionId, student.id));
        return Promise.all(promises);
    });
}
// Add a student to a promotion
function addStudentToPromotion(promotionId, studentId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.post(`${URL_PROMOTIONS}/${promotionId}/students`, { studentId });
            if (response.status !== 201)
                throw new Error('Failed to add student to promotion');
            const studentResponse = yield (0, userService_1.getUserById)(studentId);
            // On envoie un email à l'étudiant pour l'informer de son ajout à la promotion
            if (studentResponse) {
                yield (0, notificationService_1.sendPromotionEnrollmentEmail)(studentResponse.email, studentResponse.promotionName);
            }
            return response.data;
        }
        catch (error) {
            throw new Error('Failed to add student to promotion');
        }
    });
}
function getPromotionById(promotionId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const [promoRes, usersRes, projectsRes] = yield Promise.all([
                apiClient_1.apiClient.get(`${URL_PROMOTIONS}/${promotionId}`),
                apiClient_1.apiClient.get(`${URL_USERS}`),
                apiClient_1.apiClient.get(`${URL_PROJECTS}/promotion/${promotionId}`)
            ]);
            if (promoRes.status !== 200)
                throw new Error('Failed to fetch promotion');
            if (usersRes.status !== 200)
                throw new Error('Failed to fetch users');
            if (projectsRes.status !== 200)
                throw new Error('Failed to fetch projects');
            const students = usersRes.data.filter((user) => user.role.name === "student".toUpperCase());
            // Associer les étudiants à partir de promotionStudents
            const studentList = (yield Promise.all(((_a = promoRes.data.promotionStudents) === null || _a === void 0 ? void 0 : _a.map((ps) => __awaiter(this, void 0, void 0, function* () {
                return students.find((student) => student.id === ps.studentId);
            }))) || [])).filter(Boolean);
            delete promoRes.data.promotionStudents;
            return Object.assign(Object.assign({}, promoRes.data), { Students: studentList, Projects: projectsRes.data || [] });
        }
        catch (error) {
            throw new Error('Failed to fetch promotion by ID');
        }
    });
}
function getPromotionByStudentId(studentId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_PROMOTIONS}/students/${studentId}`);
            if (response.status !== 200)
                throw new Error('Failed to fetch promotion by student ID');
            const promotionData = response.data;
            const promotionIds = Array.isArray(promotionData) ? promotionData.map((promo) => promo.id) : [promotionData.id];
            const projects = yield Promise.all(promotionIds.map((promotionId) => __awaiter(this, void 0, void 0, function* () {
                const projectsList = yield (0, projectService_1.getProjectsByPromotionId)(promotionId);
                return yield Promise.all(projectsList.map((project) => __awaiter(this, void 0, void 0, function* () {
                    // Appel au service groupe
                    const groups = yield (0, groupService_1.getGroupByProjectId)(project.id);
                    return Object.assign(Object.assign({}, project), { groups });
                })));
            })));
            // Si plusieurs promotions, on retourne un tableau enrichi
            if (Array.isArray(promotionData)) {
                return promotionData.map((promo, index) => (Object.assign(Object.assign({}, promo), { projects: projects[index] })));
            }
            // Sinon, promotion unique
            return Object.assign(Object.assign({}, promotionData), { projects: projects[0] });
        }
        catch (error) {
            console.error('Error fetching promotion by student ID:', error);
            throw new Error('Failed to fetch promotion by student ID');
        }
    });
}
function getAllPromotions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [promotionRes, users, projectRes] = yield Promise.all([
                apiClient_1.apiClient.get(URL_PROMOTIONS),
                apiClient_1.apiClient.get(`${URL_USERS}`),
                apiClient_1.apiClient.get(URL_PROJECTS),
            ]);
            if (promotionRes.status !== 200)
                throw new Error('1 Échec récupération promotions');
            if (projectRes.status !== 200)
                throw new Error('2 Échec récupération projets');
            if (users.status !== 200)
                throw new Error('3 Échec récupération utilisateurs');
            const projectList = projectRes.data.projects;
            if (!Array.isArray(projectList))
                throw new Error('4 Liste de projets invalide');
            const students = users.data.filter((user) => user.role.name === "student".toUpperCase());
            const enrichedPromotions = yield Promise.all(promotionRes.data.map((promotion) => __awaiter(this, void 0, void 0, function* () {
                const projects = yield (0, projectService_1.getProjectsByPromotionId)(promotion.id);
                const studentList = (promotion.promotionStudents || [])
                    .map((ps) => students.find((s) => s.id === ps.studentId))
                    .filter(Boolean);
                return Object.assign(Object.assign({}, promotion), { students: studentList, projects: projects });
            })));
            return enrichedPromotions;
        }
        catch (error) {
            console.error('Error fetching promotions:', error);
            throw new Error('4Failed to fetch promotions');
        }
    });
}
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield apiClient_1.apiClient.get(`${URL_PROMOTIONS}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch promotions');
            }
            return response.data;
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
