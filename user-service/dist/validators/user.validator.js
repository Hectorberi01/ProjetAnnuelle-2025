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
    phoneNumber: joi_1.default.string().allow(null, "").optional(),
    adresse: joi_1.default.string().allow(null, "").optional(),
    isActive: joi_1.default.boolean().default(true),
    // Pour gérer les étudiants avec promotion
    //promotionId: Joi.number().integer().optional(),
    statut: joi_1.default.boolean().optional(), // utilisé pour 
});
exports.updateUserSchema = joi_1.default.object({
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    roleId: joi_1.default.number().integer().optional(),
    password: joi_1.default.string().optional(),
    address: joi_1.default.string().allow(null, "").optional(),
    phoneNumber: joi_1.default.string().allow(null, "").optional(),
});
