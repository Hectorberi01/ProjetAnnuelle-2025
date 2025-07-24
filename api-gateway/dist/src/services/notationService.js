"use strict";
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
exports.getGradingCriteria = getGradingCriteria;
exports.addGradingCriteria = addGradingCriteria;
exports.validateSpecificGrille = validateSpecificGrille;
exports.getGrillesCritere = getGrillesCritere;
exports.createGrille = createGrille;
exports.publishProjectGrades = publishProjectGrades;
exports.updateGradingCriteria = updateGradingCriteria;
exports.updateCritere = updateCritere;
exports.deleteCriteria = deleteCriteria;
exports.deleteGradingCriteria = deleteGradingCriteria;
exports.validateGradingGrid = validateGradingGrid;
exports.getGradingGridByProjectAndGroup = getGradingGridByProjectAndGroup;
exports.saveCritereNote = saveCritereNote;
exports.saveGlobalComment = saveGlobalComment;
exports.finalizeGroupNotation = finalizeGroupNotation;
exports.getGradingGridById = getGradingGridById;
const services_config_1 = require("../config/services.config");
const apiClient_1 = require("../utils/apiClient"); // ou axios directement
const URL_GRADING = services_config_1.SERVICES.notations || 'http://localhost:3005/notations';
// --- Critères ---
function getGradingCriteria(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.get(`${URL_GRADING}/${projectId}/grilles`);
        return response.data;
    });
}
function addGradingCriteria(projectId, criteria) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.post(`${URL_GRADING}/${projectId}/grilles`, criteria);
        return response.data;
    });
}
function validateSpecificGrille(projectId, groupId, grilleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.post(`${URL_GRADING}/${projectId}/groups/${groupId}/notation/grilles/${grilleId}/validate`);
        return response.data;
    });
}
function getGrillesCritere(projectId, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.get(`${URL_GRADING}/${projectId}/groups/${groupId}/grilles/criteres`);
        return response.data;
    });
}
function createGrille(projectId, groupId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.post(`${URL_GRADING}/${projectId}/groups/${groupId}/criteres`, data);
        return response.data;
    });
}
function publishProjectGrades(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.post(`${URL_GRADING}/${projectId}/publish`);
        return response.data;
    });
}
function updateGradingCriteria(grilleId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.put(`${URL_GRADING}/grilles/${grilleId}`, data);
        return response.data;
    });
}
function updateCritere(grilleId, critereId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.put(`${URL_GRADING}/${grilleId}/criteres/${critereId}`, data);
        return response.data;
    });
}
function deleteCriteria(grilleId, critereId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield apiClient_1.apiClient.delete(`${URL_GRADING}/${grilleId}/criteres/${critereId}`);
    });
}
function deleteGradingCriteria(grilleId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield apiClient_1.apiClient.delete(`${URL_GRADING}/grilles/${grilleId}`);
    });
}
function validateGradingGrid(grilleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.post(`${URL_GRADING}/grilles/${grilleId}/validate`);
        return response.data;
    });
}
function getGradingGridByProjectAndGroup(projectId, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.get(`${URL_GRADING}/${projectId}/groups/${groupId}/notation`);
        return response.data;
    });
}
function saveCritereNote(projectId, groupId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.post(`${URL_GRADING}/${projectId}/groups/${groupId}/notation/critere`, data);
        return response.data;
    });
}
function saveGlobalComment(projectId, groupId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.post(`${URL_GRADING}/${projectId}/groups/${groupId}/notation/commentaire-global`, data);
        return response.data;
    });
}
function finalizeGroupNotation(projectId, groupId, data, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.post(`${URL_GRADING}/${projectId}/groups/${groupId}/notation/finalize`, data, {
            headers: { 'user-id': userId }
        });
        return response.data;
    });
}
function getGradingGridById(grilleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield apiClient_1.apiClient.get(`${URL_GRADING}/grilles/${grilleId}`);
        return response.data;
    });
}
