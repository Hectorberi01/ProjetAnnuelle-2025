"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    nom: joi_1.default.string().required(),
    prenom: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    roleId: joi_1.default.number().integer().required(),
});
exports.updateUserSchema = joi_1.default.object({
    nom: joi_1.default.string(),
    prenom: joi_1.default.string(),
    email: joi_1.default.string().email(),
    roleId: joi_1.default.number().integer(),
});
