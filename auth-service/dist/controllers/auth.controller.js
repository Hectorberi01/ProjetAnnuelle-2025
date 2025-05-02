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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.checkToken = exports.changePassword = exports.verifyEmail = exports.refreshToken = exports.me = exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const AuthService = __importStar(require("../services/auth.service"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield AuthService.register(req.body);
    res.status(result.status).json(result.data);
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log("email", email);
    console.log("password", password);
    const result = yield AuthService.login(req.body);
    res.status(result.status).json(result.data);
});
exports.login = login;
const logout = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ message: 'Logged out successfully' });
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body", req.body);
    const { Email } = req.body;
    const result = yield AuthService.forgotPassword(Email);
    res.status(result.status).json(result.data);
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    const result = yield AuthService.resetPassword(token, newPassword);
    res.status(result.status).json(result.data);
});
exports.resetPassword = resetPassword;
const me = (req, res) => {
    res.status(200).json({ user: req.user });
};
exports.me = me;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        const result = yield AuthService.refreshToken(refreshToken);
        res.status(result.status).json(result.data);
    }
    catch (error) {
        next(error);
    }
});
exports.refreshToken = refreshToken;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const result = yield AuthService.verifyEmail(token);
    res.status(result.status).json(result.data);
});
exports.verifyEmail = verifyEmail;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { oldPassword, newPassword } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield AuthService.changePassword(userId, oldPassword, newPassword);
    res.status(result.status).json(result.data);
});
exports.changePassword = changePassword;
const checkToken = (req, res) => {
    const { token } = req.body;
    const result = AuthService.checkToken(token);
    res.status(result.status).json(result.data);
};
exports.checkToken = checkToken;
