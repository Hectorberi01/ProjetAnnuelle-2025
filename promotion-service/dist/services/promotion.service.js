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
exports.PromotionService = void 0;
const database_1 = require("../config/database");
const Promotion_1 = require("../entities/Promotion");
const PromotionStudent_1 = require("../entities/PromotionStudent");
class PromotionService {
    constructor() {
        this.promotionRepo = database_1.AppDataSource.getRepository(Promotion_1.Promotion);
        this.promotionStudentRepo = database_1.AppDataSource.getRepository(PromotionStudent_1.PromotionStudent);
    }
    create(name, startYear, endYear) {
        return __awaiter(this, void 0, void 0, function* () {
            const promo = this.promotionRepo.create({ name, startYear, endYear });
            return this.promotionRepo.save(promo);
        });
    }
    addStudentToPromotion(promotionId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const promo = yield this.promotionRepo.findOneBy({ id: promotionId });
            if (!promo) {
                throw new Error("Promotion not found");
            }
            const add = this.promotionStudentRepo.create({
                promotionId: promo.id,
                studentId: studentId,
            });
            yield this.promotionStudentRepo.save(add);
            return add;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.promotionRepo.find({ relations: ["promotionStudents"] });
        });
    }
    findByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const promos = yield this.promotionRepo
                .createQueryBuilder("promotion")
                .innerJoinAndSelect("promotion.promotionStudents", "promotionStudent")
                .where("promotionStudent.studentId = :studentId", { studentId })
                .getMany();
            promos.forEach(promo => promo.promotionStudents.forEach(student => delete student.promotion));
            return promos;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const promo = yield this.promotionRepo.findOne({ where: { id }, relations: ["promotionStudents"] });
            if (!promo) {
                throw new Error("Promotion not found");
            }
            promo.promotionStudents.forEach(student => delete student.promotion);
            return promo;
            // return this.promotionRepo.findOne({
            //   where: { id },  
            //   relations: ["promotionStudents"]
            // });
        });
    }
    update(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.promotionRepo.update(id, updateData);
            return this.promotionRepo.findOneBy({ id });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promo = yield this.promotionRepo.findOne({
                    where: { id },
                    relations: ["promotionStudents"],
                });
                if (!promo) {
                    throw new Error("Promotion not found");
                }
                return yield this.promotionRepo.remove(promo);
            }
            catch (error) {
                console.error('Error deleting promotion:', error);
                throw new Error('Failed to delete promotion');
            }
        });
    }
}
exports.PromotionService = PromotionService;
