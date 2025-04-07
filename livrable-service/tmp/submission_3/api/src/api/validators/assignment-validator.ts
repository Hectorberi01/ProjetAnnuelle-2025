import Joi from "joi"

export interface assignmentPostRequest {
    memberId: number
    taskId: number
}

export const assignmentPostValidation = Joi.object<assignmentPostRequest>({
    memberId: Joi.number().integer().required(),
    taskId: Joi.number().integer().required()
}).options({abortEarly: true})

export interface assignmentPatchRequest {
    id: number
    memberId: number
    taskId: number
}

export const assignmentPatchValidation = Joi.object<assignmentPatchRequest>({
    id: Joi.number().integer().required(),
    memberId: Joi.number().integer().required(),
    taskId: Joi.number().integer().required()
}).options({abortEarly: true})
