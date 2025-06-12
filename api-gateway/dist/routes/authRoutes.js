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
const authService_1 = require("../services/authService");
const router = (0, express_1.Router)();
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, authService_1.LoginUser)(req.body);
        res.json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Register endpoint hit with body:", req.body);
    try {
        const data = yield (0, authService_1.RegisterUser)(req.body);
        res.json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.post('/register-admin', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, authService_1.RegisterAdminUser)(req.body);
        res.json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.post('/forgot-password', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }
        const data = yield (0, authService_1.forgotPassword)(email);
        res.json(data);
    }
    catch (err) {
        next(err);
    }
}));
// change-password endpoint is not implemented in the original code, so it is omitted here.
router.post('/change-password', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            res.status(400).json({ error: 'Old and new passwords are required' });
            return;
        }
        // Implement change password logic here
        const response = yield (0, authService_1.changePassword)(req.body.userId, oldPassword, newPassword);
        if (!response) {
            res.status(400).json({ error: 'Failed to change password' });
            return;
        }
        res.status(200).json({ message: 'Password changed successfully' });
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
