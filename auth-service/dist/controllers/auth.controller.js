"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.changePassword = exports.me = exports.forgotPassword = exports.logout = exports.login = exports.registerAdmin = exports.register = void 0;
const AuthService = __importStar(require("../services/auth.service"));
//OK
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Register request received:', req.body);
        const result = yield AuthService.register(req.body);
        res.status(result.status).json(result.data);
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.register = register;
// register admin
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield AuthService.createAdminUser(req.body);
        res.status(201).json({ message: 'Admin user created successfully', data: result });
    }
    catch (error) {
        console.error('Error creating admin user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.registerAdmin = registerAdmin;
// Login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log('Login request received:', { email, password });
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }
    const result = yield AuthService.login({ email, password });
    console.log('Login result:', result);
    res.status(200).json(result.data);
});
exports.login = login;
// Logout
const logout = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.logout = logout;
// forgot password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }
        const result = yield AuthService.forgotPassword(email);
        if (result.status === 200) {
            res.status(200).json({ message: 'Email de réinitialisation envoyé' });
        }
        else {
            res.status(result.status).json(result.data);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.forgotPassword = forgotPassword;
const me = (req, res) => {
    res.status(200).json({ user: req.user });
};
exports.me = me;
// Change password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            res.status(400).json({ error: 'Old password and new password are required' });
            return;
        }
        const userId = req.user.user.id;
        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }
        const result = yield AuthService.changePassword(userId, oldPassword, newPassword);
        if (result.status === 200) {
            res.status(200).json({ message: 'Password changed successfully' });
        }
        else {
            res.status(result.status).json(result.data);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.changePassword = changePassword;
