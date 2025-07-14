import Joi from 'joi';

// ✅ Validation pour la création d’une grille de notation
export const createGradingSheetSchema = Joi.object({
  projectId: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required()
    .messages({
      'any.required': 'projectId est requis',
      'string.guid': 'projectId invalide'
    }),

  name: Joi.string().min(1).required().messages({
    'string.empty': 'Le nom de la grille est requis'
  }),

  type: Joi.string()
    .valid('livrable', 'rapport', 'soutenance')
    .required()
    .messages({
      'any.only': 'Le type est invalide',
      'any.required': 'Le type est requis'
    }),

  scope: Joi.string()
    .valid('group', 'individual')
    .required()
    .messages({
      'any.only': 'La portée est invalide',
      'any.required': 'La portée est requise'
    }),

  criteria: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(1).required().messages({
          'string.empty': 'Le nom du critère est requis'
        }),
        weight: Joi.number().min(0).max(100).required().messages({
          'number.base': 'Poids invalide',
          'number.min': 'Poids trop petit',
          'number.max': 'Poids trop grand'
        }),
        allowComment: Joi.boolean().required()
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'Au moins un critère est requis'
    })
});

// ✅ Validation pour la soumission des notes
export const gradeSubmissionSchema = Joi.object({
  targetId: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required()
    .messages({
      'any.required': 'ID du groupe ou étudiant requis',
      'string.guid': 'ID du groupe ou étudiant invalide'
    }),

  grades: Joi.array()
    .items(
      Joi.object({
        criterionId: Joi.string()
          .guid({ version: ['uuidv4'] })
          .required()
          .messages({
            'string.guid': 'ID du critère invalide',
            'any.required': 'ID du critère requis'
          }),
        grade: Joi.number().min(0).max(20).required().messages({
          'number.base': 'Note invalide',
          'number.min': 'Note trop basse',
          'number.max': 'Note trop élevée'
        }),
        comment: Joi.string().optional()
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'Il faut au moins une note'
    })
});
