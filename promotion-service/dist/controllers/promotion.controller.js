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
const promotion_service_1 = require("../services/promotion.service");
const service = new promotion_service_1.PromotionService();
class PromotionController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, startYear, endYear } = req.body;
            const promotion = yield service.create(name, startYear, endYear);
            res.status(201).json(promotion);
        });
    }
    static addStudentToPromotion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const promotionId = Number(req.params.id);
            console.log("promotionId", promotionId);
            const studentId = Number(req.body.studentId);
            console.log("studentId", studentId);
            const promotionStudent = yield service.addStudentToPromotion(promotionId, studentId);
            res.status(201).json(promotionStudent);
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const promotions = yield service.findAll();
            res.json(promotions);
        });
    }
    static getByStudentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = Number(req.params.id);
            const promotions = yield service.findByStudentId(studentId);
            if (promotions.length === 0) {
                res.status(404).json({ message: "Not found" });
                return;
            }
            res.status(200).json(promotions);
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const promotion = yield service.findById(id);
            if (!promotion) {
                res.status(404).json({ message: "Not found" });
                return;
            }
            res.status(200).json(promotion);
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const updated = yield service.update(id, req.body);
            res.status(200).json(updated);
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            yield service.delete(id);
            res.status(204).send();
        });
    }
}
exports.PromotionController = PromotionController;
