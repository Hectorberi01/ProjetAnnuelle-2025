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
const service = new group_service_1.GroupService(database_1.AppDataSource);
class GroupController {
    static getAllGroups(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const groups = yield service.getAllGroups();
                res.status(200).json(groups);
            }
            catch (error) {
                console.error('Error fetching groups:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static getGroupById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupId = parseInt(req.params.id);
            try {
                const group = yield service.getGroupById(groupId);
                if (!group) {
                    res.status(404).json({ message: 'Group not found' });
                    return;
                }
                res.status(200).json(group);
            }
            catch (error) {
                console.error('Error fetching group by ID:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static createGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { projectId, name } = req.body;
            try {
                const group = yield service.createGroup(projectId, name);
                if (!group) {
                    res.status(400).json({ message: 'Group creation failed' });
                    return;
                }
                res.status(201).json(group);
            }
            catch (e) {
                res.status(400).json({ message: 'Group creation failed' });
            }
        });
    }
    static getGroupsByProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Fetching groups by project');
                console.log(req.params.projectId);
                if (!req.params.projectId) {
                    res.status(400).json({ error: 'Project ID is required' });
                    return;
                }
                const projectId = parseInt(req.params.projectId);
                const groups = yield service.getGroupByProjectId(projectId);
                res.status(200).json(groups);
            }
            catch (error) {
                console.error('Error fetching groups by project:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static updateGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupId = parseInt(req.params.id);
            const { name } = req.body;
            try {
                const updatedGroup = yield service.updateGroup(groupId, name);
                if (!updatedGroup) {
                    res.status(404).json({ message: 'Group not found' });
                    return;
                }
                res.status(200).json(updatedGroup);
            }
            catch (e) {
                res.status(400).json({ error: e });
            }
        });
    }
    static getStudentsInGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupId = parseInt(req.params.id);
            try {
                const students = yield service.getStudentsInGroup(groupId);
                if (!students) {
                    res.status(404).json({ message: 'No students found in this group' });
                    return;
                }
                res.status(200).json(students);
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
    static removeStudentFromGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { groupId, studentId } = req.body;
            try {
                const result = yield service.removeStudentFromGroup(groupId, studentId);
                res.status(200).json(result);
            }
            catch (e) {
                res.status(400).json({ error: e });
            }
        });
    }
    static deleteGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupId = parseInt(req.params.id);
            try {
                const result = yield service.deleteGroup(groupId);
                if (!result) {
                    res.status(404).json({ message: 'Group not found' });
                    return;
                }
                res.status(200).json({ message: 'Group deleted successfully' });
            }
            catch (e) {
                res.status(400).json({ error: e });
            }
        });
    }
    static deleteGroupsByProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectId = parseInt(req.params.projectId);
            try {
                const result = yield service.deleteGroupByProjectId(projectId);
                res.status(200).json(result);
            }
            catch (e) {
                res.status(400).json({ error: e });
            }
        });
    }
}
exports.GroupController = GroupController;
