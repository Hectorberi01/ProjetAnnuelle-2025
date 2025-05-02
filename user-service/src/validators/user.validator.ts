import Joi from "joi";

export const createUserSchema = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  email: Joi.string().email().required(),
  roleId: Joi.number().integer().required(),
});

export const updateUserSchema = Joi.object({
  nom: Joi.string().optional(),
  prenom: Joi.string().optional(),
  email: Joi.string().email().optional(),
  roleId: Joi.number().integer().optional(),
  password: Joi.string().optional(),
});
