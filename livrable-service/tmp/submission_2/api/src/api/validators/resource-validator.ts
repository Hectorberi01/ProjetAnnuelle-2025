import Joi from "joi"

export interface resourcePostRequest {
    name: string
    resourceTypeId: number
}

export const resourcePostValidation = Joi.object<resourcePostRequest>({
    name: Joi.string().required(),
    resourceTypeId: Joi.number().integer().required()
}).options({abortEarly: true})

export interface resourcePatchRequest {
    id: number
    name: string
    resourceTypeId: number
}

export const resourcePatchValidation = Joi.object<resourcePatchRequest>({
    id: Joi.number().required(),
    name: Joi.string().required(),
    resourceTypeId: Joi.number().integer().required()
}).options({abortEarly: true})
