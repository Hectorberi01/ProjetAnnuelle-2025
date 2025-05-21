import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";

const repo = AppDataSource.getRepository('Report');

export class ReportService {
  constructor() {}

  public async createReport(data: any) {
    try {
      const report =  repo.create(data);
      return await repo.save(report);
    } catch (error) {
      console.error('Error creating report:', error);
      throw new Error('Failed to create report');
    }
  }

  // Mettre à jour le rapport
  public async updateReport(id: number, data: any) {
    try {
      const report = await repo.findOneBy({ id });

      if (!report) throw new Error('Report not found');
      return await repo.update({ id }, data);

    } catch (error) {
      console.error('Error updating report:', error);
      throw new Error('Failed to update report');
    }
  }

  // Récupérer tous les rapports d'un projet
  public async findByProject(projectId: number) {
    try {
      const reports = await repo.find({ where: { projectId } });
      return reports;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    }
  }

  // Récupérer tous les rapports
  public async findAll() {
    try {
      const reports = await repo.find();
      return reports;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    } 
  }

  // Récupérer un rapport par son ID
  public async findById(id: number) {
    try {
      const report = await repo.findOne({ where: { id } });
      if (!report) throw new Error('Report not found');
      return report;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw new Error('Failed to fetch report');
    }
  }

  // supprimer un rapport
  public async deleteReport(id: number) {
    try {
      const report = await repo.findOne({ where: { id } });
      if (!report) throw new Error('Report not found');
      await repo.delete({ id });
      return { message: 'Report deleted successfully' };
    } catch (error) {
      console.error('Error deleting report:', error);
      throw new Error('Failed to delete report');
    }
  }
}