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
const GroupConfig_1 = require("../entities/GroupConfig");
const groupeStudent_1 = require("../entities/groupeStudent");
class GroupService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.groupRepo = this.dataSource.getRepository(Group_1.Group);
        this.configRepo = this.dataSource.getRepository(GroupConfig_1.GroupConfig);
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
    createManualGroup(projectId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            // on vérifie si le nom du groupe est unique
            const existingGroup = yield this.groupRepo.findOneBy({ name, projectId });
            if (existingGroup)
                throw new Error('Group name already exists');
            const group = this.groupRepo.create({ projectId, name });
            return this.groupRepo.save(group);
        });
    }
    getGroupsByProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.groupRepo.find({ where: { projectId } });
        });
    }
    createRandomGroups(projectId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = this.groupRepo.create({ projectId, name });
            return yield this.groupRepo.save(group);
        });
    }
    createFreeGroups(projectId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = this.groupRepo.create({ projectId, name });
            return yield this.groupRepo.save(group);
        });
    }
    addStudentToGroup(groupId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.groupRepo.findOneBy({ id: groupId });
            if (!group)
                throw new Error('Group not found');
            const groupStudent = this.groupStudentRepo.create({ studentId, createdAt: new Date(), groupStudent: group });
            return this.groupStudentRepo.save(groupStudent);
        });
    }
}
exports.GroupService = GroupService;
