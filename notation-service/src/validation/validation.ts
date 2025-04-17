import { z } from "zod";
import { EvaluationType } from "../entities/Notation";

export const criterionSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  maxPoints: z.number().positive(),
  weight: z.number().min(0).max(1)
});

export const notationSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  projectId: z.number(),
  type: z.nativeEnum(EvaluationType),
  isIndividual: z.boolean(),
  weight: z.number().min(0).max(1),
  isPublished: z.boolean().optional(),
  globalComment: z.string().optional(),
  criteria: z.array(criterionSchema)
});
