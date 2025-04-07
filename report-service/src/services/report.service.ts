import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";

const repo = AppDataSource.getRepository('Report');

export class ReportService {
  constructor() {}

  public async createReport(projectId: number, groupId: number) {
    const report =  repo.create({ projectId, groupId });
    return await repo.save(report);
  }

  public async findByProject(projectId: number) {
    return await repo.find({ where: { projectId }, relations: ['sections'] });
  }

  public async findOne(id: number) {
    return await repo.findOne({ where: { id }, relations: ['sections'] });
  }
}