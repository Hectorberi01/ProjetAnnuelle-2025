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
const express_1 = require("express");
const projectService_1 = require("../services/projectService");
const promotionService_1 = require("../services/promotionService");
const multer_1 = __importDefault(require("multer"));
const GoogleDriveService_1 = require("../services/GoogleDriveService");
const cloudfareService_1 = require("../services/cloudfareService");
const groupService_1 = require("../services/groupService");
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const googleDriveService = new GoogleDriveService_1.GoogleDriveService();
// Get all projects
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, projectService_1.getAllProjects)();
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
}));
// Get project by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = parseInt(req.params.id);
    try {
        const result = yield (0, projectService_1.getProjectById)(projectId);
        if ('error' in result) {
            res.status(result.status || 500).json({ message: result.error });
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch project" });
        return;
    }
}));
router.get('/url', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileUrl } = req.query;
    console.log('Received fileUrl:', fileUrl);
    if (!fileUrl || typeof fileUrl !== 'string') {
        return res.status(400).json({ message: 'Paramètre fileUrl manquant ou invalide.' });
    }
    try {
        const key = (0, cloudfareService_1.extractKeyFromS3Url)(fileUrl);
        console.log('Extracted key from fileUrl:', key);
        //const url = new URL(fileUrl);
        //const key = decodeURIComponent(url.pathname.replace(/^\/+/, '')); 
        const signedUrl = yield (0, cloudfareService_1.getSignedPdfUrl)(key);
        console.log('Generated signed URL:', signedUrl);
        // Redirige automatiquement vers le lien sécurisé
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(key)}"`);
        return res.redirect(signedUrl);
    }
    catch (error) {
        console.error('Erreur lors de la génération de l’URL signée :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
}));
router.get("/promotion/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const promotionId = parseInt(req.params.id);
    console.log("Fetching projects for promotion ID:", promotionId);
    try {
        const response = yield (0, projectService_1.getProjectsByPromotionId)(promotionId);
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error fetching projects for promotion:", error);
        res.status(500).json({ message: "Failed to fetch projects for promotion" });
        return;
    }
}));
//Create a new project
router.post("/", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectData = JSON.parse(req.body.project);
        const file = req.file;
        if (!projectData) {
            res.status(400).json({ message: "Invalid project data" });
            return;
        }
        const promotionId = projectData.promotionId;
        if (!promotionId) {
            res.status(400).json({ message: "Promotion ID is required" });
            return;
        }
        // Check if the promotion ID is valid
        const promotion = yield (0, promotionService_1.getPromotionById)(promotionId);
        if (!promotion) {
            res.status(404).json({ message: "Promotion not found" });
            return;
        }
        let fileUrl = undefined;
        if (file) {
            fileUrl = yield (0, cloudfareService_1.uploadPDFToR2)(file);
            projectData.url = fileUrl;
        }
        const project = yield (0, projectService_1.createProject)(projectData);
        if (project.status !== 201) {
            res.status(400).json({ message: "Failed to create project" });
            return;
        }
        const projectCreated = project.data;
        const { maxStudents, minStudents, mode } = projectCreated;
        const projectId = projectCreated.id;
        const students = promotion.Students || [];
        const totalStudents = students.length;
        // Mélanger les étudiants
        const shuffled = students.sort(() => Math.random() - 0.5);
        const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
        // Calculer le nombre de groupes
        const numberOfGroups = Math.ceil(totalStudents / maxStudents);
        const createdGroups = [];
        for (let i = 0; i < numberOfGroups; i++) {
            const groupName = `Groupe ${i + 1}`;
            const groupRes = yield (0, groupService_1.createGroup)(groupName, projectId);
            if (groupRes.status !== 201) {
                res.status(400).json({ message: "Failed to create group" });
                return;
            }
            const groupData = groupRes.data;
            const groupId = groupData.id;
            createdGroups.push({ id: groupId, name: groupName });
        }
        const availableGroups = [...createdGroups];
        // Si le mode est "random", on affecte les étudiants
        if (mode === "random") {
            for (let i = 0; i < shuffledStudents.length; i++) {
                if (availableGroups.length === 0)
                    break;
                const groupIndex = i % availableGroups.length;
                const student = shuffledStudents[i];
                const groupId = availableGroups[groupIndex].id;
                const groupe = yield (0, groupService_1.getGroupByIdWitoutEnriching)(groupId);
                if (groupe.status !== 200)
                    continue;
                const groupeData = groupe.data;
                if (groupeData.groupStudent.length >= maxStudents) {
                    availableGroups.splice(groupIndex, 1);
                    i--; // Revenir en arrière pour réessayer avec un autre groupe
                    continue;
                }
                yield (0, groupService_1.JoinToGroup)(groupId, student.id);
            }
        }
        res.status(201).json(projectCreated);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create project" });
        return;
    }
}));
// Update a project
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = parseInt(req.params.id);
    const projectData = req.body;
    console.log("projectData", projectData);
    try {
        const response = yield (0, projectService_1.getProjectById)(projectId);
        if (!response) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        console.log("response");
        console.log("avant le update");
        const updatedProject = yield (0, projectService_1.updateProject)(projectId, projectData);
        console.log("status", updatedProject.status);
        if (updatedProject.status !== 200) {
            res.status(400).json({ message: "Failed to update project" });
            return;
        }
        res.status(200).json(updatedProject.data);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update project" });
        return;
    }
}));
// Delete a project
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = parseInt(req.params.id);
    try {
        const response = yield (0, projectService_1.getProjectById)(projectId);
        if (response.status !== 200) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const deletedProject = yield (0, projectService_1.deleteProject)(projectId);
        if (deletedProject.status !== 200) {
            res.status(400).json({ message: "Failed to delete project" });
            return;
        }
        res.status(200).json({ message: "Project deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete project" });
        return;
    }
}));
// add soutenance information to a project
router.post("/soutenance/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = parseInt(req.params.id);
    console.log("Adding soutenance information for project ID:", projectId);
    const { soutenanceDate, soutenanceDuration, lieuSoutenance } = req.body;
    try {
        const response = yield (0, projectService_1.getProjectById)(projectId);
        if (!response) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const updatedProject = yield (0, projectService_1.updateProject)(projectId, {
            soutenanceDate,
            soutenanceDuration,
            lieuSoutenance
        });
        if (updatedProject.status !== 200) {
            res.status(400).json({ message: "Failed to add soutenance information" });
            return;
        }
        res.status(200).json(updatedProject.data);
    }
    catch (error) {
        console.error("Error adding soutenance information:", error);
        res.status(500).json({ message: "Failed to add soutenance information" });
        return;
    }
}));
// update soutenance information of a project
router.put("/soutenance/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = parseInt(req.params.id);
    const { soutenanceDate, soutenanceDuration, lieuSoutenance } = req.body;
    try {
        const response = yield (0, projectService_1.getProjectById)(projectId);
        if (!response) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const updatedProject = yield (0, projectService_1.updateProject)(projectId, {
            soutenanceDate,
            soutenanceDuration,
            lieuSoutenance
        });
        if (updatedProject.status !== 200) {
            res.status(400).json({ message: "Failed to update soutenance information" });
            return;
        }
        res.status(200).json(updatedProject.data);
    }
    catch (error) {
        console.error("Error updating soutenance information:", error);
        res.status(500).json({ message: "Failed to update soutenance information" });
        return;
    }
}));
exports.default = router;
