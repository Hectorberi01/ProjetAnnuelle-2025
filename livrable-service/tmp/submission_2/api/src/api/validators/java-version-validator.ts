import Joi from "joi";

export interface javaVersionRequest {
    versionName: string;
    experimental: boolean
    file: Buffer
}

export const javaVersionValidation = Joi.object<javaVersionRequest>({
    versionName: Joi.string().required(),
    experimental: Joi.string().required(),
    file: Joi.binary().required(),
}).options({ abortEarly: true });

export interface javaVersionInformationResponse {
    versionName: string;
    experimental: boolean;
    downloadLink: string;
}
