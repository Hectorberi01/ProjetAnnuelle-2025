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
const express_1 = require("express");
const projectService_1 = require("../services/projectService");
const promotionService_1 = require("../services/promotionService");
const router = (0, express_1.Router)();
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
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectData = req.body;
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
        const response = yield (0, projectService_1.createProject)(projectData);
        if (response.status !== 201) {
            res.status(400).json({ message: "Failed to create project" });
            return;
        }
        res.status(201).json(response.data);
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
        if (response.status !== 200) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
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
