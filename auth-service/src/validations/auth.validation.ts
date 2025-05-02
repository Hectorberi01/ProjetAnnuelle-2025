import Joi from 'joi';

const safeString = Joi.string()
  .pattern(/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/)
  .min(2)
  .required()
  .messages({
    'string.empty': 'Ce champ est requis',
    'string.pattern.base': 'Caractères invalides détectés',
    'string.min': 'Doit contenir au moins 2 caractères',
  });

export const registerSchema = Joi.object({
  nom: safeString.label("Prénom"),
  prenom: safeString.label("Nom"),
  email: Joi.string().email().required().messages({
    'string.empty': "L'email est requis",
    'string.email': "L'email n'est pas valide",
  }),
  roleId: Joi.number().integer().min(1).required().messages({
    'number.base': "Le rôle est requis",
    'number.integer': "Le rôle doit être un entier",
    'number.min': "Le rôle doit être supérieur ou égal à 1",
  }),
});