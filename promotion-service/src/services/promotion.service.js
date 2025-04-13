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
class PromotionService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.repo = database_1.AppDataSource.getRepository(Promotion_1.Promotion);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promotion = this.repo.create(data);
            return this.repo.save(promotion);
        });
    }
    findAll() {
        return this.repo.find();
    }
    findOne(id) {
        return this.repo.findOneBy({ id });
    }
    delete(id) {
        return this.repo.delete({ id });
    }
}
exports.PromotionService = PromotionService;
