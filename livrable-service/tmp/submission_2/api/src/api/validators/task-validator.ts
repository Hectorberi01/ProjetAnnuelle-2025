import Joi from "joi"

export interface taskPostRequest {
    name: string
    details: string
    startsAt: string
    endsAt: string
}

export const taskPostValidation = Joi.object<taskPostRequest>({
    name: Joi.string().required(),
    details: Joi.string().required(),
    startsAt: Joi.date().iso().greater("now").required(),
    endsAt: Joi.date().iso().greater(Joi.ref("startsAt")).required(),
}).options({abortEarly: true})

export interface taskPatchRequest {
    id: number
    name: string
    details: string
    startsAt: string
    endsAt: string
}

export const taskPatchValidation = Joi.object<taskPatchRequest>({
    id: Joi.number().integer().required(),
    name: Joi.string().required(),
    details: Joi.string().required(),
    startsAt: Joi.date().iso().greater("now").required(),
    endsAt: Joi.date().iso().greater(Joi.ref("startsAt")).required(),
}).options({abortEarly: true})
