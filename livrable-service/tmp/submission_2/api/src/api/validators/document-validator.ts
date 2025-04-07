import Joi from "joi";

export interface documentsRequest {
    title: string;
    description: string;
    path: string;
    fileData: Buffer;
    organizationId: number;
}

export const documentsValidation = Joi.object<documentsRequest>({
    title: Joi.string().required(),
    description: Joi.string().required(),
    path: Joi.string().default('/').optional(),
    fileData: Joi.binary().required(),
    organizationId: Joi.number().required(),
}).options({ abortEarly: true });

export const documentsPatchValidation = Joi.object<documentsRequest>({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    path: Joi.string().optional(),
    fileData: Joi.binary().optional(),
    organizationId: Joi.number().optional(),
}).options({ abortEarly: true });
