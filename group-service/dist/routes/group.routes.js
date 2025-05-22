"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const group_controller_1 = require("../controllers/group.controller");
const router = express_1.default.Router();
router.get('/', group_controller_1.GroupController.getAllGroups);
router.post('/manual', group_controller_1.GroupController.createManualGroup);
router.get('/project/:projectId', group_controller_1.GroupController.getGroupsByProject);
router.post('/random/:projectId', group_controller_1.GroupController.createRandomGroups);
router.post('/free/:projectId', group_controller_1.GroupController.createFreeGroups);
router.get('/:id', group_controller_1.GroupController.getGroupById);
//router.post('/config', GroupController.setGroupConfig);
//router.put('/config/:projectId', GroupController.updateGroupConfig);
//router.get('/config/:projectId', GroupController.getGroupConfig);
router.post('/addStudent', group_controller_1.GroupController.addStudentToGroup);
exports.default = router;
