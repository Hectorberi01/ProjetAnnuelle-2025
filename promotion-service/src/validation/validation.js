"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionSchema = void 0;
const zod_1 = require("zod");
exports.PromotionSchema = zod_1.z.object({
    nom: zod_1.z.string().min(3, 'Nom requis'),
    annee: zod_1.z.string().regex(/^\d{4}-\d{4}$/, 'Format attendu : 2024-2025'),
});
