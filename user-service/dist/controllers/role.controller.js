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
exports.deleteRole = exports.updateRole = exports.getRoleByName = exports.getRoleById = exports.getAllRoles = exports.createRole = void 0;
const role_service_1 = require("../services/role.service");
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield new role_service_1.RoleService().create(req.body);
        res.status(201).json(role);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createRole = createRole;
const getAllRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getAll roles");
    const roles = yield new role_service_1.RoleService().findAll();
    res.status(200).json(roles);
});
exports.getAllRoles = getAllRoles;
const getRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("getById role");
    const id = Number((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (isNaN(id)) {
        res.status(400).json({ message: "ID invalide" });
        return;
    }
    const role = yield new role_service_1.RoleService().findById(id);
    if (!role) {
        res.status(404).json({ message: "Rôle non trouvé" });
        return;
    }
    res.status(200).json(role);
});
exports.getRoleById = getRoleById;
const getRoleByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("getByName role");
    const name = (_a = req.params) === null || _a === void 0 ? void 0 : _a.name;
    if (!name) {
        res.status(400).json({ message: "Nom invalide" });
        return;
    }
    const role = yield new role_service_1.RoleService().findByName(name);
    if (!role) {
        res.status(404).json({ message: "Rôle non trouvé" });
        return;
    }
    res.status(200).json(role);
});
exports.getRoleByName = getRoleByName;
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("update role");
    const id = Number((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (isNaN(id)) {
        res.status(400).json({ message: "ID invalide" });
        return;
    }
    const updated = yield new role_service_1.RoleService().update(id, req.body);
    if (!updated) {
        res.status(404).json({ message: "Rôle non trouvé" });
        return;
    }
    res.status(200).json(updated);
});
exports.updateRole = updateRole;
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("delete role");
    const id = Number((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (isNaN(id)) {
        res.status(400).json({ message: "ID invalide" });
        return;
    }
    const deleted = yield new role_service_1.RoleService().delete(id);
    if (!deleted) {
        res.status(404).json({ message: "Rôle non trouvé" });
        return;
    }
    res.status(204).send();
});
exports.deleteRole = deleteRole;
