// services/GradeGridService.ts
import { AppDataSource } from "../config/database";
import { GradeGrid } from "../entities/GradeGrid";
import { GradeCriterion } from "../entities/GradeCriterion";


export class GradeGridService {
  private gradeGridRepo = AppDataSource.getRepository(GradeGrid);
  private criterionRepo = AppDataSource.getRepository(GradeCriterion);

  async createGrid(projectId: number, name: string, type: 'LIVRABLE' | 'RAPPORT' | 'SOUTENANCE') {
    const grid = this.gradeGridRepo.create({ name, type, projectId });
    return await this.gradeGridRepo.save(grid);
  }

  async addCriteria(gridId: number, criteria: { title: string, weight: number }[]) {
    const grid = await this.gradeGridRepo.findOneByOrFail({ id: gridId });
    const criterionEntities = criteria.map(c =>
      this.criterionRepo.create({ ...c, grid })
    );
    return await this.criterionRepo.save(criterionEntities);
  }

  async finalizeGrid(gridId: number) {
    const grid = await this.gradeGridRepo.findOneByOrFail({ id: gridId });
    grid.isFinalized = true;
    return await this.gradeGridRepo.save(grid);
  }

  async getGrid(gridId: number) {
    return await this.gradeGridRepo.findOne({
      where: { id: gridId },
      relations: ['criteria'],
    });
  }
}