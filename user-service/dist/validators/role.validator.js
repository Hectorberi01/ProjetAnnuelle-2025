"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleSchema = exports.createRoleSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createRoleSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(50).required(),
});
exports.updateRoleSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(50),
});
