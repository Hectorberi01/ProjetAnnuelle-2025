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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDeliverables = getAllDeliverables;
exports.getDeliverableById = getDeliverableById;
exports.getDeliverablesByGroup = getDeliverablesByGroup;
exports.getDeliverablesByProjectId = getDeliverablesByProjectId;
exports.submitDeliverable = submitDeliverable;
exports.downloadDeliverable = downloadDeliverable;
exports.similarityCheck = similarityCheck;
exports.similarityMatrix = similarityMatrix;
const services_config_1 = require("../config/services.config");
const form_data_1 = __importDefault(require("form-data"));
const fetch = require('node-fetch');
const LIVRABLES_URL = services_config_1.SERVICES.livrables || "http://localhost:3009/deliverables";
function getAllDeliverables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${LIVRABLES_URL}`);
            if (!response.ok) {
                throw new Error('Failed to fetch deliverables');
            }
            return yield response.json();
        }
        catch (error) {
            console.error('Error fetching deliverables:', error);
            throw new Error('Failed to fetch deliverables');
        }
    });
}
function getDeliverableById(deliverableId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${LIVRABLES_URL}/${deliverableId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch deliverable with ID ${deliverableId}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error(`Error fetching deliverable with ID ${deliverableId}:`, error);
            throw new Error(`Failed to fetch deliverable with ID ${deliverableId}`);
        }
    });
}
function getDeliverablesByGroup(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${LIVRABLES_URL}/groups/${groupId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch deliverables for group ID ${groupId}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error(`Error fetching deliverables for group ID ${groupId}:`, error);
            throw new Error(`Failed to fetch deliverables for group ID ${groupId}`);
        }
    });
}
function getDeliverablesByProjectId(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Fetching deliverables URL: ${LIVRABLES_URL}/project/${projectId}`);
            const response = yield fetch(`${LIVRABLES_URL}/project/${projectId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch deliverables for project ID ${projectId}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error(`Error fetching deliverables for project ID ${projectId}:`, error);
            throw new Error(`Failed to fetch deliverables for project ID ${projectId}`);
        }
    });
}
function submitDeliverable(formData) {
    return __awaiter(this, void 0, void 0, function* () {
        const form = new form_data_1.default();
        form.append('name', formData.name);
        form.append('description', formData.description);
        if (formData.githubUrl) {
            form.append('githubUrl', formData.githubUrl);
        }
        form.append('groupId', formData.groupId.toString());
        form.append('projectId', formData.projectId.toString());
        form.append('fileUrl', formData.fileUrl);
        try {
            const response = yield fetch(`${LIVRABLES_URL}`, {
                method: 'POST',
                body: form
            });
            //const text = await response.text(); // pour voir le contenu brut
            console.log('Status:', response.status);
            //console.log('Response body:', text);
            if (response.status !== 201) {
                throw new Error('Failed to submit deliverable');
            }
            return yield response.json();
        }
        catch (error) {
            console.error('Error submitting deliverable:', error);
            throw new Error('Failed to submit deliverable');
        }
    });
}
function downloadDeliverable(deliverableId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${LIVRABLES_URL}/${deliverableId}/download`);
            if (!response.ok) {
                throw new Error(`Failed to download deliverable with ID ${deliverableId}`);
            }
            const arrayBuffer = yield response.arrayBuffer();
            return Buffer.from(arrayBuffer);
            //return await response.blob();
        }
        catch (error) {
            console.error(`Error downloading deliverable with ID ${deliverableId}:`, error);
            throw new Error(`Failed to download deliverable with ID ${deliverableId}`);
        }
    });
}
function similarityCheck(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${LIVRABLES_URL}/internal/similarity-check/project/${projectId}`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error(`Failed to perform similarity check for project ID ${projectId}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error(`Error performing similarity check for project ID ${projectId}:`, error);
            throw new Error(`Failed to perform similarity check for project ID ${projectId}`);
        }
    });
}
function similarityMatrix(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${LIVRABLES_URL}/projects/${projectId}/similarity-matrix`);
            if (!response.ok) {
                throw new Error(`Failed to fetch similarity matrix for project ID ${projectId}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error(`Error fetching similarity matrix for project ID ${projectId}:`, error);
            throw new Error(`Failed to fetch similarity matrix for project ID ${projectId}`);
        }
    });
}
