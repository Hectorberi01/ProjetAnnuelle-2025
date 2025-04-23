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
exports.roleControllerInstance = exports.RoleController = void 0;
const role_service_1 = require("../services/role.service");
const inspector_1 = require("inspector");
class RoleController {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield this.roleService.create(req.body);
                res.status(201).json(role);
            }
            catch (err) {
                res.status(400).json({ message: err.message });
            }
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            inspector_1.console.log("getAll called");
            const roles = yield this.roleService.findAll();
            res.json(roles);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = Number((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID invalide" });
                return;
            }
            const updated = yield this.roleService.update(id, req.body);
            if (!updated) {
                res.status(404).json({ message: "Rôle non trouvé" });
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
            const deleted = yield this.roleService.delete(id);
            if (!deleted) {
                res.status(404).json({ message: "Rôle non trouvé" });
                return;
            }
            res.status(204).send();
        });
        this.roleService = new role_service_1.RoleService();
    }
}
exports.RoleController = RoleController;
exports.roleControllerInstance = new RoleController();
