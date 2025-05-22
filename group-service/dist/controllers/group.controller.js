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
exports.GroupController = void 0;
const group_service_1 = require("../services/group.service");
const database_1 = require("../config/database");
const validation_1 = require("../validation/validation");
const service = new group_service_1.GroupService(database_1.AppDataSource);
class GroupController {
    static getAllGroups(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groups = yield service.getAllGroups();
            console.log(groups);
            res.status(200).json(groups);
        });
    }
    static getGroupById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupId = parseInt(req.params.id);
            const group = yield service.getGroupById(groupId);
            if (!group) {
                res.status(404).json({ message: 'Group not found' });
                return;
            }
            res.status(200).json(group);
        });
    }
    static createManualGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating manual group');
            console.log(req.body);
            const { error, value } = validation_1.manualGroupSchema.validate(req.body);
            if (error)
                res.status(400).json({ error: error.details });
            try {
                const group = yield service.createManualGroup(value.projectId, value.studentIds);
                res.status(201).json(group);
            }
            catch (e) {
                res.status(400).json({ error: e });
            }
        });
    }
    static getGroupsByProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectId = parseInt(req.params.projectId);
            const groups = yield service.getGroupsByProject(projectId);
            res.status(200).json(groups);
        });
    }
    static createRandomGroups(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectId = parseInt(req.params.projectId);
            const { name } = req.body;
            try {
                const result = yield service.createRandomGroups(projectId, name);
                res.status(201).json(result);
            }
            catch (e) {
                res.status(400).json({ error: e });
            }
        });
    }
    static createFreeGroups(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectId = parseInt(req.params.projectId);
            const { name } = req.body;
            try {
                const result = yield service.createFreeGroups(projectId, name);
                res.status(201).json(result);
            }
            catch (e) {
                res.status(400).json({ error: e });
            }
        });
    }
    static addStudentToGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { groupId, studentId } = req.body;
            try {
                const result = yield service.addStudentToGroup(groupId, studentId);
                res.status(201).json(result);
            }
            catch (e) {
                res.status(400).json({ error: e });
            }
        });
    }
}
exports.GroupController = GroupController;
