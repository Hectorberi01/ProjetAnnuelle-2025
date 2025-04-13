"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionController = void 0;
const validation_1 = require("../validation/validation");
const promotion_service_1 = require("../services/promotion.service");
const database_1 = require("../config/database"); // Make sure path is correct
const service = new promotion_service_1.PromotionService(database_1.AppDataSource);
class PromotionController {
    // Remove "async" before the assignment - this is a syntax error
    static createPromotion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = validation_1.PromotionSchema.parse(req.body);
                const promo = yield service.create(data);
                res.status(201).json(promo);
            }
            catch (e) {
                res.status(400).json({ error: e.message });
            }
        });
    }
    // Remove "async" before the assignment - this is a syntax error
    static getPromotions(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const promos = yield service.findAll();
            res.json(promos);
        });
    }
    // Renamed from getPromotion to getPromotionById for clarity
    static getPromotionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const promo = yield service.findOne(req.params.id);
            if (!promo)
                return res.status(404).json({ error: 'Non trouvé' });
            res.json(promo);
        });
    }
    // Remove "async" before the assignment - this is a syntax error
    static deletePromotion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield service.delete(req.params.id);
            res.status(204).send();
        });
    }
}
exports.PromotionController = PromotionController;
