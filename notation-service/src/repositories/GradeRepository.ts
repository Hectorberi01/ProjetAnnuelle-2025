import { AppDataSource } from '../config/database';
import { Grade } from '../entities/Grade';

export class GradeRepository {
  private repository = AppDataSource.getRepository(Grade);

  async create(gradeData: Partial<Grade>): Promise<Grade> {
    const grade = this.repository.create(gradeData);
    return await this.repository.save(grade);
  }

  async findByStudentAndProject(studentId: string, projectId: string): Promise<Grade | null> {
    return await this.repository.findOne({
      where: { studentId, projectId }
    });
  }

  async findByProjectId(projectId: string): Promise<Grade[]> {
    return await this.repository.find({
      where: { projectId },
      order: { finalScore: 'DESC' }
    });
  }

  async findPublishedByStudentAndProject(studentId: string, projectId: string): Promise<Grade | null> {
    return await this.repository.findOne({
      where: { studentId, projectId, isPublished: true }
    });
  }

  async upsert(
    projectId: string, 
    studentId: string, 
    groupId: string, 
    gradeData: Partial<Grade>
  ): Promise<Grade> {
    const existingGrade = await this.repository.findOne({
      where: { projectId, studentId, groupId }
    });

    if (existingGrade) {
      await this.repository.update(existingGrade.id, gradeData);
      const updatedGrade = await this.repository.findOne({ where: { id: existingGrade.id } });
      if (!updatedGrade) {
        throw new Error('Grade not found after update');
      }
      return updatedGrade;
    } else {
      const newGrade = this.repository.create({
        projectId,
        studentId,
        groupId,
        ...gradeData
      });
      return await this.repository.save(newGrade);
    }
  }

  async publishGradesByProject(projectId: string): Promise<void> {
    await this.repository.update(
      { projectId },
      { isPublished: true }
    );
  }
}