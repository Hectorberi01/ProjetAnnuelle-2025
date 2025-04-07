import { Users } from "@prisma/client";
import Joi from "joi";

export enum MemberStatus {
  VOLUNTEER = "VOLUNTEER",
  SUBSCRIBER = "SUBSCRIBER",
  INTERN = "INTERN",
  EMPLOYEE = "EMPLOYEE",
}

export interface MemberRequest {
  role: string;
  isAdmin: boolean;
  userId: number;
  organizationId: number;
  status: MemberStatus;
  user: userMemberRequest;
}

export interface userMemberRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export const memberValidation = Joi.object<MemberRequest>({
  role: Joi.string().default("volunteer"),
  isAdmin: Joi.boolean().default(false),
  userId: Joi.number().integer().required(),
  organizationId: Joi.number().integer().required(),
  status: Joi.string()
    .valid(...Object.values(MemberStatus))
    .default(MemberStatus.VOLUNTEER),
}).options({ abortEarly: true });

export const memberPatchValidation = Joi.object<Partial<MemberRequest>>({
  role: Joi.string(),
  isAdmin: Joi.boolean(),
  status: Joi.string().valid(...Object.values(MemberStatus)),
  user: Joi.object<Users>({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
  }),
}).options({ abortEarly: false });
