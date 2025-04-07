import Joi from "joi"

export interface resourceTypePostRequest {
    type: string
}

export const resourceTypePostValidation = Joi.object<resourceTypePostRequest>({
    type: Joi.string().required()
}).options({abortEarly: true})

export interface resourceTypePatchRequest {
    id: number
    type: string
}

export const resourceTypePatchValidation = Joi.object<resourceTypePatchRequest>({
    id: Joi.number().required(),
    type: Joi.string().required()
}).options({abortEarly: true})
