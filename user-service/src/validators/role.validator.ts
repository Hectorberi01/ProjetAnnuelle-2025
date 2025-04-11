import Joi from "joi";

export const createRoleSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
});

export const updateRoleSchema = Joi.object({
  name: Joi.string().min(2).max(50),
});
