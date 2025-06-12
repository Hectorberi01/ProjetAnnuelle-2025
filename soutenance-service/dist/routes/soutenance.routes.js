"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const soutenanceController_1 = require("../controllers/soutenanceController");
const router = (0, express_1.Router)();
router.post('/', soutenanceController_1.SoutenanceController.generate);
router.get('/:projectId', soutenanceController_1.SoutenanceController.get);
router.put('/:id', soutenanceController_1.SoutenanceController.update);
exports.default = router;
