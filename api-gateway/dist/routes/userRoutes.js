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
const userService_1 = require("../services/userService");
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, userService_1.getAllUsers)();
        if (!response || response.length === 0) {
            res.status(404).json({ message: 'No users found' });
            return;
        }
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error in user service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// get students
router.get('/students', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, userService_1.getStudents)();
        if (!response || response.length === 0) {
            res.status(404).json({ message: 'No students found' });
            return;
        }
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error in user service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    try {
        const response = yield (0, userService_1.getUserById)(userId);
        if (!response) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error in user service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// user by email
router.get('/email/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    try {
        const response = yield (0, userService_1.getUserByEmail)(email);
        if (!response) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error in user service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
//delete user
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    try {
        const response = yield (0, userService_1.getUserById)(userId);
        if (!response) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const deleteResponse = yield (0, userService_1.deleteUser)(userId);
        if (!deleteResponse) {
            res.status(500).json({ message: 'Failed to delete user' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error in user service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
