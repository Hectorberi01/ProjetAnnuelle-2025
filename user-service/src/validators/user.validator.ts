import Joi from "joi";

export const createUserSchema = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  email: Joi.string().email().required(),
  roleId: Joi.number().integer().required(),
});

export const updateUserSchema = Joi.object({
  nom: Joi.string(),
  prenom: Joi.string(),
  email: Joi.string().email(),
  roleId: Joi.number().integer(),
});
