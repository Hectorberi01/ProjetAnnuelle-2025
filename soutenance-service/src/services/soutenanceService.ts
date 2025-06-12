import { AppDataSource } from "../config/database";
import { Soutenance } from "../entities/Soutenance";

interface ISoutenanceService {
    projectId: number;
    groupIds: number[];
    mode: 'fixed' | 'auto';
    startTime: Date;
    durationInMinutes?: number;
    endTime?: Date;
}


export class SoutenanceService {

    static async generateSchedule(data: ISoutenanceService): Promise<Soutenance[]> {

        const repo = AppDataSource.getRepository(Soutenance);
        await repo.delete({ projectId: data.projectId });

        const schedules: Soutenance[] = [];

        if (data.mode === 'fixed' && data.durationInMinutes) {

            for (const [index, groupId] of data.groupIds.entries()) {

                const start = new Date(data.startTime);

                start.setMinutes(start.getMinutes() + index * data.durationInMinutes);

                const end = new Date(start);

                end.setMinutes(start.getMinutes() + data.  durationInMinutes);

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
                schedules.push(schedule);
            }
        }

        return await repo.save(schedules);
    }

    static async getSchedule(projectId: number) {
        return AppDataSource.getRepository(Soutenance).find({ where: { projectId }, order: { order: 'ASC' } });
    }

    static async updateSlot(id: number, data: Partial<Soutenance>) {
        const repo = AppDataSource.getRepository(Soutenance);
        await repo.update(id, data);
        return repo.findOneBy({ id });
    }
}