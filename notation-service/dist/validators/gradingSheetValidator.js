"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeSubmissionSchema = exports.createGradingSheetSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// ✅ Validation pour la création d’une grille de notation
exports.createGradingSheetSchema = joi_1.default.object({
    projectId: joi_1.default.string()
        .guid({ version: ['uuidv4'] })
        .required()
        .messages({
        'any.required': 'projectId est requis',
        'string.guid': 'projectId invalide'
    }),
    name: joi_1.default.string().min(1).required().messages({
        'string.empty': 'Le nom de la grille est requis'
    }),
    type: joi_1.default.string()
        .valid('livrable', 'rapport', 'soutenance')
        .required()
        .messages({
        'any.only': 'Le type est invalide',
        'any.required': 'Le type est requis'
    }),
    scope: joi_1.default.string()
        .valid('group', 'individual')
        .required()
        .messages({
        'any.only': 'La portée est invalide',
        'any.required': 'La portée est requise'
    }),
    criteria: joi_1.default.array()
        .items(joi_1.default.object({
        name: joi_1.default.string().min(1).required().messages({
            'string.empty': 'Le nom du critère est requis'
        }),
        weight: joi_1.default.number().min(0).max(100).required().messages({
            'number.base': 'Poids invalide',
            'number.min': 'Poids trop petit',
            'number.max': 'Poids trop grand'
        }),
        allowComment: joi_1.default.boolean().required()
    }))
        .min(1)
        .required()
        .messages({
        'array.min': 'Au moins un critère est requis'
    })
});
// ✅ Validation pour la soumission des notes
exports.gradeSubmissionSchema = joi_1.default.object({
    targetId: joi_1.default.string()
        .guid({ version: ['uuidv4'] })
        .required()
        .messages({
        'any.required': 'ID du groupe ou étudiant requis',
        'string.guid': 'ID du groupe ou étudiant invalide'
    }),
    grades: joi_1.default.array()
        .items(joi_1.default.object({
        criterionId: joi_1.default.string()
            .guid({ version: ['uuidv4'] })
            .required()
            .messages({
            'string.guid': 'ID du critère invalide',
            'any.required': 'ID du critère requis'
        }),
        grade: joi_1.default.number().min(0).max(20).required().messages({
            'number.base': 'Note invalide',
            'number.min': 'Note trop basse',
            'number.max': 'Note trop élevée'
        }),
        comment: joi_1.default.string().optional()
    }))
        .min(1)
        .required()
        .messages({
        'array.min': 'Il faut au moins une note'
    })
});
