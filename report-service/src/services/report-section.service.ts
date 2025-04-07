import { Repository } from "typeorm";
import { ReportSection } from "../entities/ReportSection.entity";
import { AppDataSource } from "../config/database";
import { Report } from "../entities/Report.entity";
const sectionRepo = AppDataSource.getRepository(ReportSection);
const reportRepo = AppDataSource.getRepository(Report);

export class ReportSectionService {
  constructor() {}

  public async createSection(reportId: number, title: string, content: string, order: number) {
    console.log('Creating section');

    const report = await reportRepo.findOneBy({ id: reportId });
    if (!report) throw new Error('Report not found');

    console.log('✔️ Report loaded:', report);

    const section = sectionRepo.create({ report, title, content, order });
    return await sectionRepo.save(section);
  }

  public async updateSection(id: number, content: string) {
    return await sectionRepo.update({ id }, { content });
  }

  public async getSection(id: number) {
    return await sectionRepo.findOne({ where: { id }, relations: ['report'] });
  }
}
