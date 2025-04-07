import Joi from "joi";

interface newConversationRequest{
    message: string,
    organizationId: number
}

interface message{
    role: role;
    content: string;
}

enum role{
    user="user",assistant="assistant"
}
const messageJoi = Joi.object().keys({
    role: Joi.string().valid('user','system').required(),
    content: Joi.string().required()
})

export const newConversationValidator = Joi.object<newConversationRequest>({
    message: Joi.string().required(),
    organizationId: Joi.number().required(),
}).options({abortEarly: true})

interface continueConversationRequest{
    message: string,
    threadId: string
}

export const continueConversationValidator = Joi.object<continueConversationRequest>({
    message: Joi.string().required(),
    threadId: Joi.string().required()
}).options({abortEarly: true})