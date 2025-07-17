import { Router } from "express";
import multer from 'multer';
import { addStudentToPromotion,getAll, createPromotion, deletePromotion, getAllPromotions, getPromotionById, getPromotionByStudentId, updatePromotion, addStudentUsingCSV } from "../services/promotionService";
import { deleteProject, getProjectsByPromotionId } from "../services/projectService";
import { deleteGroupsByProjectId } from "../services/groupService";
const upload = multer();
const router = Router();

// Get all promotions
router.get("/", async (req, res) => {
    const promotions = await getAllPromotions();
    res.json(promotions);
});

// Get all
router.get("/all", async (req, res) => {
    try {
        const promotions = await getAll();
        res.status(200).json(promotions);
    } catch (error) {
        console.error('Error fetching promotions:', error);
        res.status(500).json({ message: "Failed to fetch promotions" });
    }
});

// Get a promotion by ID
router.get("/:id", async (req, res) => {
    const promotionId =  parseInt(req.params.id);
    const promotion = await getPromotionById(promotionId);
    res.json(promotion);
});

// Create a new promotion
router.post("/", upload.single('file'), async (req, res) => {
    try {
        const promotion = req.body;
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: "File is required" });
        }

        const createdPromotion = await createPromotion(promotion, file);

        res.status(201).json(createdPromotion);
    } catch (error) {
        console.error('Error creating promotion:', error);
        res.status(500).json({ message: "Failed to create promotion" });
    }
});

// Add students to a promotion using CSV
router.post("/:id/students/csv", upload.single('file'), async (req, res) => {
    const promotionId = parseInt(req.params.id);
    const file = req.file;

    try {
        await addStudentUsingCSV(promotionId, file);
        res.status(200).json({ message: "Students added successfully" });
    } catch (error) {
        console.error('Error adding students from CSV:', error);
        res.status(500).json({ message: "Failed to add students from CSV" });
    }
});

// Add a student to a promotion
router.post("/:id/students", async (req, res) => {
    const promotionId =parseInt(req.params.id);
    const studentId = parseInt(req.body.studentId);
    
    try {
        const response = await addStudentToPromotion(promotionId, studentId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error adding student to promotion:', error);
        res.status(500).json({ message: "Failed to add student to promotion" });
    }
});

// Get promotions by student ID
router.get("/students/:id", async (req, res) => {
    const studentId = parseInt(req.params.id);
    try {
        const promotions = await getPromotionByStudentId(studentId);
        if (promotions.length === 0) {
            res.status(404).json({ message: "No promotions found for this student" });
            return;
        }
        res.status(200).json(promotions);
    } catch (error) {
        console.error('Error fetching promotions by student ID:', error);
        res.status(500).json({ message: "Failed to fetch promotions by student ID" });
    }
});

//Update a promotion
router.put("/:id", async (req, res) => {
    const promotionId = parseInt(req.params.id);
    const promotionData = req.body;
    try {
        const response = await updatePromotion(promotionId,promotionData);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating promotion:', error);
        res.status(500).json({ message: "Failed to update promotion" });
    }
});
// Delete a promotion
router.delete("/:id", async (req, res) => {
    const promotionId = parseInt(req.params.id);
    try {
        // projet rattaché à la promotion
        const projects = await getProjectsByPromotionId(promotionId);

        let projectIds = [];
        if (projects.length != 0) {
            projectIds = projects.map(project => project.id);
        }

        for (const projectId of projectIds) {
            // Delete the project associated with the promotion
            await deleteGroupsByProjectId(projectId);

            // Assuming you have a function to delete projects by ID
            await deleteProject(projectId);
        }
        

        // Delete the promotion
        const response = await deletePromotion(promotionId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error deleting promotion:', error);
        res.status(500).json({ message: "Failed to delete promotion" });
    }
});

export default router;