"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const group_controller_1 = require("../controllers/group.controller");
const router = express_1.default.Router();
router.get('/', group_controller_1.GroupController.getAllGroups);
router.get('/:id', group_controller_1.GroupController.getGroupById);
router.post('/', group_controller_1.GroupController.createGroup);
router.put('/:id', group_controller_1.GroupController.updateGroup);
router.get('/project/:projectId', group_controller_1.GroupController.getGroupsByProject);
router.post('/add-student', group_controller_1.GroupController.addStudentToGroup);
router.delete('/remove-student', group_controller_1.GroupController.removeStudentFromGroup);
router.get('/students/:id', group_controller_1.GroupController.getStudentsInGroup);
router.delete('/:id', group_controller_1.GroupController.deleteGroup);
router.delete('/project/:projectId', group_controller_1.GroupController.deleteGroupsByProject);
exports.default = router;
