import Joi from "joi";

export interface membershipTypesRequest {
  name: string;
  description: string;
  amount: number;
  duration: number;
  organizationId: number;
}

export const membershipTypesCreateValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  amount: Joi.number().required(),
  duration: Joi.number().required(),
  organizationId: Joi.number().required(),
});

export const membershipTypesUpdateValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  amount: Joi.number().required(),
  organizationId: Joi.number(),
});
