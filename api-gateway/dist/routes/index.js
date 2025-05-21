"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const promotionRoutes_1 = __importDefault(require("./promotionRoutes"));
const projectRoutes_1 = __importDefault(require("./projectRoutes"));
const groupRoutes_1 = __importDefault(require("./groupRoutes"));
const router = (0, express_1.Router)();
router.use('/api/auth', authRoutes_1.default);
router.use('/api/promotions', promotionRoutes_1.default);
router.use('/api/projects', projectRoutes_1.default);
router.use('/api/groups', groupRoutes_1.default);
exports.default = router;
