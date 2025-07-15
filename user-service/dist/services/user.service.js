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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../database/database");
const User_1 = require("../database/entities/User");
const Role_1 = require("../database/entities/Role");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor() {
        this.userRepo = database_1.AppDataSource.getRepository(User_1.User);
        this.roleRepo = database_1.AppDataSource.getRepository(Role_1.Role);
    }
    // Create
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const role = yield this.roleRepo.findOneBy({ id: data.roleId });
            if (!role)
                throw new Error("Rôle non trouvé");
            const username = data.prenom.trim().charAt(0).toLowerCase() +
                data.nom.trim().substring(0, 7).toLowerCase();
            const password = username;
            // Hasher le mot de passe
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = this.userRepo.create({
                nom: data.nom,
                prenom: data.prenom,
                email: data.email,
                username: username,
                phoneNumber: data.phoneNumber || "null",
                address: data.address || "null",
                imageUrl: data.imageUrl || "null",
                isActive: (_a = data.isActive) !== null && _a !== void 0 ? _a : true,
                createdAt: (_b = data.createdAt) !== null && _b !== void 0 ? _b : new Date(),
                lastLoginAt: (_c = data.lastLoginAt) !== null && _c !== void 0 ? _c : null,
                role,
                password: hashedPassword,
            });
            return this.userRepo.save(user);
        });
    }
    // créer un utilisateur avec mot de passe
    createAdmin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.roleRepo.findOneBy({ id: 1 });
            if (!role)
                throw new Error("Rôle non trouvé");
            const username = data.prenom.trim().charAt(0).toLowerCase() +
                data.nom.trim().substring(0, 7).toLowerCase();
            // Hasher le mot de passe
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            const user = this.userRepo.create({
                username,
                nom: data.nom,
                prenom: data.prenom,
                email: data.email,
                role,
                password: hashedPassword,
            });
            return this.userRepo.save(user);
        });
    }
    // UserList
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userRepo.find({
                relations: ["role"],
            });
            return data;
        });
    }
    // UserById
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepo.findOne({ where: { id }, relations: ["role"] });
        });
    }
    // UserByEmail
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepo.findOne({ where: { email }, relations: ["role"] });
                return user !== null && user !== void 0 ? user : null;
            }
            catch (error) {
                console.error("Error in findByEmail:", error);
                return null;
            }
        });
    }
    // UserUpdate
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findOneBy({ id });
            if (!user)
                return null;
            // Hash the password if it is provided
            if (data.password) {
                const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
                data.password = hashedPassword;
            }
            Object.assign(user, data);
            return this.userRepo.save(user);
        });
    }
    updateLastLogin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findOneBy({ id });
            if (!user)
                return null;
            user.lastLoginAt = new Date();
            return this.userRepo.save(user);
        });
    }
    // UserDelete
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepo.delete(id);
            return result.affected !== 0;
        });
    }
}
exports.UserService = UserService;
