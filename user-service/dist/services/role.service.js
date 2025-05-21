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
exports.RoleService = void 0;
const database_1 = require("../database/database");
const Role_1 = require("../database/entities/Role");
class RoleService {
    constructor() {
        this.roleRepo = database_1.AppDataSource.getRepository(Role_1.Role);
    }
    // RoleCreate
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = this.roleRepo.create(data);
            return this.roleRepo.save(role);
        });
    }
    // RoleList
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.roleRepo.find();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.roleRepo.findOneBy({ id });
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.roleRepo.findOneBy({ name });
        });
    }
    // RoleUpdate
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.roleRepo.findOneBy({ id });
            if (!role)
                return null;
            Object.assign(role, data);
            return this.roleRepo.save(role);
        });
    }
    // RoleDelete
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.roleRepo.delete(id);
            return result.affected !== 0;
        });
    }
}
exports.RoleService = RoleService;
