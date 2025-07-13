"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const safeString = joi_1.default.string()
    .pattern(/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/)
    .min(2)
    .required()
    .messages({
    'string.empty': 'Ce champ est requis',
    'string.pattern.base': 'Caractères invalides détectés',
    'string.min': 'Doit contenir au moins 2 caractères',
});
exports.registerSchema = joi_1.default.object({
    nom: safeString.label("Prénom"),
    prenom: safeString.label("Nom"),
    email: joi_1.default.string().email().required().messages({
        'string.empty': "L'email est requis",
        'string.email': "L'email n'est pas valide",
    }),
    address: joi_1.default.string().optional().allow('').label("Adresse").messages({
        'string.empty': "L'adresse est requise",
    }),
    phoneNumber: joi_1.default.string().optional().allow('').pattern(/^\+?[0-9\s\-()]+$/).label("Numéro de téléphone").messages({
        'string.empty': "Le numéro de téléphone est requis",
        'string.pattern.base': "Le numéro de téléphone n'est pas valide",
    }),
    roleId: joi_1.default.number().integer().min(1).required().messages({
        'number.base': "Le rôle est requis",
        'number.integer': "Le rôle doit être un entier",
        'number.min': "Le rôle doit être supérieur ou égal à 1",
    }),
});
