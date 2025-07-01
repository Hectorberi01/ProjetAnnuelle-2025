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
exports.GroupService = void 0;
const Group_1 = require("../entities/Group");
const groupeStudent_1 = require("../entities/groupeStudent");
class GroupService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.groupRepo = this.dataSource.getRepository(Group_1.Group);
        this.groupStudentRepo = this.dataSource.getRepository(groupeStudent_1.GroupStudent);
    }
    getAllGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.groupRepo.find({
                relations: {
                    groupStudent: true,
                },
            });
        });
    }
    getGroupById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.groupRepo.findOne({
                where: { id },
                relations: {
                    groupStudent: true,
                },
            });
        });
    }
    getGroupByProjectId(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.groupRepo.find({
                where: { projectId },
                relations: {
                    groupStudent: true,
                },
            });
        });
    }
    createGroup(projectId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            // on vérifie si le nom du groupe est unique
            const existingGroup = yield this.groupRepo.findOneBy({ name, projectId });
            if (existingGroup)
                throw new Error('Group name already exists');
            const group = this.groupRepo.create({ projectId, name });
            return this.groupRepo.save(group);
        });
    }
    updateGroup(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.groupRepo.findOneBy({ id });
            if (!group)
                throw new Error('Group not found');
            group.name = name;
            return this.groupRepo.save(group);
        });
    }
    addStudentToGroup(groupId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.groupRepo.findOneBy({ id: groupId });
            if (!group)
                throw new Error('Group not found');
            console.log("Adding student to group", groupId, studentId);
            console.log("Group", group);
            const groupStudent = this.groupStudentRepo.create({ studentId, createdAt: new Date(), groupStudent: group });
            return this.groupStudentRepo.save(groupStudent);
        });
    }
    getStudentsInGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.groupStudentRepo.find({
                where: { groupStudent: { id: groupId } },
                relations: {
                    groupStudent: true,
                },
            });
        });
    }
    removeStudentFromGroup(groupId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupStudent = yield this.groupStudentRepo.findOne({
                where: { groupStudent: { id: groupId }, studentId },
            });
            if (!groupStudent)
                throw new Error('Group student not found');
            return this.groupStudentRepo.remove(groupStudent);
        });
    }
    deleteGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.groupRepo.findOneBy({ id });
            if (!group)
                throw new Error('Group not found');
            return this.groupRepo.remove(group);
        });
    }
}
exports.GroupService = GroupService;
