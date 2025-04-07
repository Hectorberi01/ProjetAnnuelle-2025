import Joi from "joi";

export interface donationsRequest {
  amount: number;
  date: Date;
  donorName: string;
  donorEmail: string;
  organizationId: number;
  recurring?: boolean;
}

export const donationsValidation = Joi.object<donationsRequest>({
  amount: Joi.number().required(),
  date: Joi.date().required(),
  donorName: Joi.string().required(),
  donorEmail: Joi.string().email().required(),
  organizationId: Joi.number().required(),
  recurring: Joi.boolean().required(),
}).options({ abortEarly: true });

export const donationsPatchValidation = Joi.object<donationsRequest>({
  amount: Joi.number().required(),
  date: Joi.date().required(),
  donorName: Joi.string().required(),
  donorEmail: Joi.string().email().required(),
  organizationId: Joi.number().required(),
  recurring: Joi.boolean().required(),
}).options({ abortEarly: true });
