import { Router } from "express";
import multer from 'multer';
import { addStudentToPromotion, createPromotion, deletePromotion, getAllPromotions, getPromotionById, updatePromotion } from "../services/promotionService";
const upload = multer();
const router = Router();

// Get all promotions
router.get("/", async (req, res) => {
    const promotions = await getAllPromotions();
    console.log("promotions", promotions);
    res.json(promotions);
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

// Add a student to a promotion
router.post("/:id/students", async (req, res) => {
    const promotionId =parseInt(req.params.id);
    const studentId = parseInt(req.body.studentId);
    console.log("promotionId", promotionId);
    console.log("studentId", studentId);
    try {
        const response = await addStudentToPromotion(promotionId, studentId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error adding student to promotion:', error);
        res.status(500).json({ message: "Failed to add student to promotion" });
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
        const response = await deletePromotion(promotionId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error deleting promotion:', error);
        res.status(500).json({ message: "Failed to delete promotion" });
    }
});

export default router;