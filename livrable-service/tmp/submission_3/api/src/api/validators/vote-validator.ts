import Joi from "joi";

export interface votesRequest {
    choice: string;
    agId: number;
    userId: number;
}

export const votesValidation = Joi.object<votesRequest>({
    choice: Joi.string().required(),
    agId: Joi.number().required(),
    userId: Joi.number().required(),
}).options({ abortEarly: true });

export const votesPatchValidation = Joi.object<votesRequest>({
    choice: Joi.string().required(),
    agId: Joi.number().required(),
    userId: Joi.number().required(),
}).options({ abortEarly: true });
