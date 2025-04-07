import Joi from "joi";
import { AGType } from "@prisma/client";

export interface agsRequest {
  title: string;
  description: string;
  date: Date;
  type: AGType;
  organizationId: number;
}

export const agsValidation = Joi.object<agsRequest>({
  title: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
  type: Joi.string().required().valid("ORDINARY", "EXTRAORDINARY"),
  organizationId: Joi.number().integer().required(),
}).options({ abortEarly: true });

export const agsPatchValidation = Joi.object<agsRequest>({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  date: Joi.date().optional(),
  type: Joi.string().optional().valid("ORDINARY", "EXTRAORDINARY"),
  organizationId: Joi.number().integer().optional(),
}).options({ abortEarly: true });

export interface AgAttendanceSchema{
  agId: number
}

export const AgAttendanceValidator = Joi.object<AgAttendanceSchema>({
  agId: Joi.number().integer().required(),
})