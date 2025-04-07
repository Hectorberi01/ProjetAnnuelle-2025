import Joi from "joi";

export interface organizationRequest {
  name: string;
  description: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  ownerId: number;
}

export const organizationValidation = Joi.object<organizationRequest>({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  type: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  ownerId: Joi.number().required(),
}).options({ abortEarly: true });

export const organizationPatchValidation = Joi.object<
  Partial<organizationRequest>
>({
  name: Joi.string(),
  description: Joi.string(),
  type: Joi.string(),
  address: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  ownerId: Joi.number(),
}).options({ abortEarly: true });
