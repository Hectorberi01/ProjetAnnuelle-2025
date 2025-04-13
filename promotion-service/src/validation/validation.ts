import { z } from 'zod';

export const PromotionSchema = z.object({
  nom: z.string().min(3, 'Nom requis'),
  annee: z.string().regex(/^\d{4}-\d{4}$/, 'Format attendu : 2024-2025'),
});

export type PromotionDTO = z.infer<typeof PromotionSchema>;
