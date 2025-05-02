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
    firstName: safeString.label("Prénom"),
    lastName: safeString.label("Nom"),
    username: joi_1.default.string()
        .alphanum()
        .min(3)
        .required()
        .messages({
        'string.empty': "Le nom d'utilisateur est requis",
        'string.alphanum': "Le nom d'utilisateur ne peut contenir que des lettres et chiffres",
        'string.min': "Le nom d'utilisateur doit contenir au moins 3 caractères",
    }),
    email: joi_1.default.string().email().required().messages({
        'string.empty': "L'email est requis",
        'string.email': "L'email n'est pas valide",
    }),
    //   PhoneNumber: Joi.string()
    //     .pattern(/^[0-9+\-.\s]{6,20}$/)
    //     .required()
    //     .messages({
    //       'string.empty': 'Le numéro de téléphone est requis',
    //       'string.pattern.base': 'Numéro de téléphone invalide',
    //     }),
    password: joi_1.default.string().min(6).required().messages({
        'string.empty': 'Le mot de passe est requis',
        'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    }),
});
