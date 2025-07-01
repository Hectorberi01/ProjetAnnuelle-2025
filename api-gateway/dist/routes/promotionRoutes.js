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
const multer_1 = __importDefault(require("multer"));
const promotionService_1 = require("../services/promotionService");
const upload = (0, multer_1.default)();
const router = (0, express_1.Router)();
// Get all promotions
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const promotions = yield (0, promotionService_1.getAllPromotions)();
    console.log("promotions", promotions);
    res.json(promotions);
}));
// Get a promotion by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const promotionId = parseInt(req.params.id);
    const promotion = yield (0, promotionService_1.getPromotionById)(promotionId);
    res.json(promotion);
}));
// Create a new promotion
router.post("/", upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotion = req.body;
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "File is required" });
        }
        const createdPromotion = yield (0, promotionService_1.createPromotion)(promotion, file);
        res.status(201).json(createdPromotion);
    }
    catch (error) {
        console.error('Error creating promotion:', error);
        res.status(500).json({ message: "Failed to create promotion" });
    }
}));
// Add a student to a promotion
router.post("/:id/students", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const promotionId = parseInt(req.params.id);
    const studentId = parseInt(req.body.studentId);
    console.log("promotionId", promotionId);
    console.log("studentId", studentId);
    try {
        const response = yield (0, promotionService_1.addStudentToPromotion)(promotionId, studentId);
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error adding student to promotion:', error);
        res.status(500).json({ message: "Failed to add student to promotion" });
    }
}));
// Get promotions by student ID
router.get("/students/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = parseInt(req.params.id);
    try {
        const promotions = yield (0, promotionService_1.getPromotionByStudentId)(studentId);
        if (promotions.length === 0) {
            res.status(404).json({ message: "No promotions found for this student" });
            return;
        }
        res.status(200).json(promotions);
    }
    catch (error) {
        console.error('Error fetching promotions by student ID:', error);
        res.status(500).json({ message: "Failed to fetch promotions by student ID" });
    }
}));
//Update a promotion
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const promotionId = parseInt(req.params.id);
    const promotionData = req.body;
    try {
        const response = yield (0, promotionService_1.updatePromotion)(promotionId, promotionData);
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error updating promotion:', error);
        res.status(500).json({ message: "Failed to update promotion" });
    }
}));
// Delete a promotion
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const promotionId = parseInt(req.params.id);
    try {
        const response = yield (0, promotionService_1.deletePromotion)(promotionId);
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error deleting promotion:', error);
        res.status(500).json({ message: "Failed to delete promotion" });
    }
}));
exports.default = router;
