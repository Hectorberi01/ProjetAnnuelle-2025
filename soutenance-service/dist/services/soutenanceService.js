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
exports.SoutenanceService = void 0;
const database_1 = require("../config/database");
const Soutenance_1 = require("../entities/Soutenance");
class SoutenanceService {
    static generateSchedule(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Generating schedule with data:', data);
            const repo = database_1.AppDataSource.getRepository(Soutenance_1.Soutenance);
            yield repo.delete({ projectId: data.projectId });
            const schedules = [];
            if (data.mode === 'fixed' && data.durationInMinutes) {
                for (const [index, groupId] of data.groupIds.entries()) {
                    const start = new Date(data.startTime);
                    start.setMinutes(start.getMinutes() + index * data.durationInMinutes);
                    const end = new Date(start);
                    end.setMinutes(start.getMinutes() + data.durationInMinutes);
                    const schedule = repo.create({
                        projectId: data.projectId,
                        groupId,
                        startTime: start,
                        endTime: end,
                        order: index + 1,
                    });
                    schedules.push(schedule);
                }
            }
            else if (data.mode === 'auto' && data.endTime) {
                const totalGroups = data.groupIds.length;
                const totalDuration = (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / 60000;
                const groupDuration = Math.floor(totalDuration / totalGroups);
                for (const [index, groupId] of data.groupIds.entries()) {
                    const start = new Date(data.startTime);
                    start.setMinutes(start.getMinutes() + index * groupDuration);
                    const end = new Date(start);
                    end.setMinutes(start.getMinutes() + groupDuration);
                    const schedule = repo.create({
                        projectId: data.projectId,
                        groupId,
                        startTime: start,
                        endTime: end,
                        order: index + 1,
                    });
                    console.log(`Generated schedule for group ${groupId}:`, schedule);
                    schedules.push(schedule);
                }
            }
            return yield repo.save(schedules);
        });
    }
    static getSchedule(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.AppDataSource.getRepository(Soutenance_1.Soutenance).find({ where: { projectId }, order: { order: 'ASC' } });
        });
    }
    static updateSlot(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = database_1.AppDataSource.getRepository(Soutenance_1.Soutenance);
            yield repo.update(id, data);
            return repo.findOneBy({ id });
        });
    }
}
exports.SoutenanceService = SoutenanceService;
