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
exports.userControllerInstance = exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.create(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.createAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("req.body");
            console.log(req.body);
            try {
                const user = yield this.userService.createAdmin(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("getAll users");
            const users = yield this.userService.findAll();
            res.status(200).json(users);
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("getById user");
            const id = Number((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID invalide" });
                return;
            }
            const user = yield this.userService.findById(id);
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }
            res.status(200).json(user);
        });
        this.getByEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("getByEmail user");
            const email = (_a = req.params) === null || _a === void 0 ? void 0 : _a.email;
            if (!email) {
                res.status(400).json({ message: "Email invalide" });
                return;
            }
            const user = yield this.userService.findByEmail(email);
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }
            res.status(200).json(user);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = Number((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID invalide" });
                return;
            }
            const updated = yield this.userService.update(id, req.body);
            if (!updated) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }
            res.json(updated);
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = Number((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID invalide" });
                return;
            }
            const deleted = yield this.userService.delete(id);
            if (!deleted) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }
            res.status(204).send();
        });
        this.userService = new user_service_1.UserService();
    }
}
exports.UserController = UserController;
exports.userControllerInstance = new UserController();
