import Joi from "joi";

export const createUserSchema = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  email: Joi.string().email().required(),
  roleId: Joi.number().integer().required(),

  phoneNumber: Joi.string().allow(null, "").optional(), 
  adresse: Joi.string().allow(null, "").optional(), 

  isActive: Joi.boolean().default(true),

  // Pour gérer les étudiants avec promotion
  //promotionId: Joi.number().integer().optional(),

  statut: Joi.boolean().optional(),       // utilisé pour 
});

export const updateUserSchema = Joi.object({
  nom: Joi.string().optional(),
  prenom: Joi.string().optional(),
  email: Joi.string().email().optional(),
  roleId: Joi.number().integer().optional(),
  password: Joi.string().optional(),
  address: Joi.string().allow(null, "").optional(),
  phoneNumber: Joi.string().allow(null, "").optional(),
});
