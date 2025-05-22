"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupConfigSchema = exports.manualGroupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.manualGroupSchema = joi_1.default.object({
    projectId: joi_1.default.number().required(),
    name: joi_1.default.string().required(),
});
exports.groupConfigSchema = joi_1.default.object({
    projectId: joi_1.default.number().required(),
    minSize: joi_1.default.number().required(),
    maxSize: joi_1.default.number().required(),
    mode: joi_1.default.string().valid('manual', 'random', 'free').required(),
    deadline: joi_1.default.date().optional()
});
