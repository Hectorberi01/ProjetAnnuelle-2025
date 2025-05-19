import { Router } from "express";
import { createProject, deleteProject, getAllProjects, getProjectById, updateProject } from "../services/projectService";
import { AxiosResponse } from "axios";
import { CreateProject, Project } from "../types/project";
import { getPromotionById } from "../services/promotionService";
const router = Router();

// Get all projects
router.get("/list", async (req, res) => {
    try{
        const response = await getAllProjects(); 
        res.status(200).json(response);
    }catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
});

// Get project by ID
router.get("/:id", async (req, res) => {
    const projectId =parseInt(req.params.id);
    try {
        const response = await getProjectById(projectId);
        if(response.status !== 200) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const project = (response as AxiosResponse<any>).data;
        res.status(200).send(project);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch project" });
        return;
    }
});

//Create a new project
router.post("/", async (req, res) => {
    try {
        const projectData:CreateProject = req.body;
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
        const promotion = await getPromotionById(promotionId);
        if (promotion.status !== 200) {
            res.status(404).json({ message: "Promotion not found" });
            return;
        }

        const response = await createProject(projectData);
        if (response.status !== 201) {
            res.status(400).json({ message: "Failed to create project" });
            return;
        }
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to create project" });
        return;
    }
});

// Update a project
router.put("/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    const projectData = req.body;
    console.log("projectData", projectData);
    try {
        const response = await getProjectById(projectId);
        if (response.status !== 200) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const updatedProject = await updateProject(projectId, projectData);
        console.log("status", updatedProject.status);
        if (updatedProject.status !== 200) {
            res.status(400).json({ message: "Failed to update project" });
            return;
        }
        res.status(200).json(updatedProject.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to update project" });
        return;
    }
});

// Delete a project
router.delete("/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    try {
        const response = await getProjectById(projectId);
        if (response.status !== 200) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const deletedProject = await deleteProject(projectId);
        if (deletedProject.status !== 200) {
            res.status(400).json({ message: "Failed to delete project" });
            return;
        }
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {  
        res.status(500).json({ message: "Failed to delete project" });
        return;
    }
});

export default router;