import Joi from "joi"

export interface taskResourcePostRequest {
    taskId: number
    resourceId: number
}

export const taskResourcePostValidation = Joi.object<taskResourcePostRequest>({
    taskId: Joi.number().integer().required(),
    resourceId: Joi.number().integer().required()
}).options({abortEarly: true})

export interface taskResourcePatchRequest {
    id: number
    taskId: number
    resourceId: number
}

export const taskResourcePatchValidation = Joi.object<taskResourcePatchRequest>({
    id: Joi.number().integer().required(),
    taskId: Joi.number().integer().required(),
    resourceId: Joi.number().integer().required()
}).options({abortEarly: true})
