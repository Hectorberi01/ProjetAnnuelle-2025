import Joi from "joi";

export interface subscriptionRequest {
  memberId: number;
  membershipTypeId: number;
  startDate: Date;
  endDate: Date;
  PaymentStatus: PaymentStatus;
  stripeSubscriptionId: string;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export const subscriptionCreateValidator = Joi.object({
  memberId: Joi.number().required(),
  membershipTypeId: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  PaymentStatus: Joi.string()
    .required()
    .valid(...Object.values(PaymentStatus)),
});

export const subscriptionUpdateValidator = Joi.object({
  memberId: Joi.number().required(),
  membershipTypeId: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  PaymentStatus: Joi.string()
    .required()
    .valid(...Object.values(PaymentStatus)),
  stripeSubscriptionId: Joi.string().required(),
});
