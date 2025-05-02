import Joi from "joi";

export const manualGroupSchema = Joi.object({
  projectId: Joi.number().required(),
  name: Joi.string().required(),
});

export const groupConfigSchema = Joi.object({
  projectId: Joi.number().required(),
  minSize: Joi.number().required(),
  maxSize: Joi.number().required(),
  mode: Joi.string().valid('manual', 'random', 'free').required(),
  deadline: Joi.date().optional()
});
