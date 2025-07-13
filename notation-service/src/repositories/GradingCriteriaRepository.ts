import { AppDataSource } from '../config/database';
import { GradingCriteria } from '../entities/GradingCriteria';

export class GradingCriteriaRepository {
  private repository = AppDataSource.getRepository(GradingCriteria);

  async create(criteriaData: Partial<GradingCriteria>): Promise<GradingCriteria> {
    const criteria = this.repository.create(criteriaData);
    return await this.repository.save(criteria);
  }

  async findByProjectId(projectId: string): Promise<GradingCriteria[]> {
    return await this.repository.find({
      where: { projectId },
      order: { createdAt: 'ASC' }
    });
  }

  async findById(id: string): Promise<GradingCriteria | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: string, updateData: Partial<GradingCriteria>): Promise<GradingCriteria | null> {
    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected! > 0;
  }

  async findByReference(projectId: string, referenceId: string): Promise<GradingCriteria[]> {
    return await this.repository.find({
      where: [
        { projectId, deliverableId: referenceId },
        { projectId, reportId: referenceId },
        { projectId, presentationId: referenceId }
      ]
    });
  }
}