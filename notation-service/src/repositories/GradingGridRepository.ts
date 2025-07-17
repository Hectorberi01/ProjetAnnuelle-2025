import { AppDataSource } from '../config/database';
import { GradingGrid, GradingType } from '../entities/GradingGrid';

export class GradingGridRepository {
  private repository = AppDataSource.getRepository(GradingGrid);

  async create(gridData: Partial<GradingGrid>): Promise<GradingGrid> {
    const grid = this.repository.create(gridData);
    return await this.repository.save(grid);
  }

  async findByParams(
    projectId: string, 
    groupId: string, 
    type: GradingType, 
    referenceId: string
  ): Promise<GradingGrid | null> {
    return await this.repository.findOne({
      where: { projectId, groupId, type, referenceId }
    });
  }

  async findById(id: string): Promise<GradingGrid | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: string, updateData: Partial<GradingGrid>): Promise<GradingGrid | null> {
    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async findByProjectId(projectId: string): Promise<GradingGrid[]> {
    return await this.repository.find({
      where: { projectId },
      order: { createdAt: 'ASC' }
    });
  }

  async findValidatedByProjectAndGroup(projectId: string, groupId: string): Promise<GradingGrid[]> {
    return await this.repository.find({
      where: { projectId, groupId, isValidated: true }
    });
  }

  async findByProjectAndGroup(projectId: string, groupId: string): Promise<GradingGrid[]> {
    return await this.repository.find({
      where: { projectId, groupId }
    });
  }
}