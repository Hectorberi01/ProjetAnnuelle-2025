"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promotion_controller_1 = require("../controllers/promotion.controller");
const router = express_1.default.Router();
router.post('/', promotion_controller_1.PromotionController.createPromotion);
router.get('/', promotion_controller_1.PromotionController.getPromotions);
router.get('/:id', promotion_controller_1.PromotionController.getPromotionById);
router.delete('/:id', promotion_controller_1.PromotionController.deletePromotion);
exports.default = router;
