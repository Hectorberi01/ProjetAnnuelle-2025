import { GradingCriteriaRepository } from '../repositories/GradingCriteriaRepository';
import { GradingGridRepository } from '../repositories/GradingGridRepository';
import { GradeRepository } from '../repositories/GradeRepository';
import { GradingCriteria } from '../entities/GradingCriteria';
import { GradingGrid, GradingType } from '../entities/GradingGrid';
import { Grade } from '../entities/Grade';

export class GradingService {
  private criteriaRepo: GradingCriteriaRepository;
  private gridRepo: GradingGridRepository;
  private gradeRepo: GradeRepository;

  constructor() {
    this.criteriaRepo = new GradingCriteriaRepository();
    this.gridRepo = new GradingGridRepository();
    this.gradeRepo = new GradeRepository();
  }

  // Gestion des critères
  async createCriteria(criteriaData: Partial<GradingCriteria>): Promise<GradingCriteria> {
    return await this.criteriaRepo.create(criteriaData);
  }

  async getCriteriaByProject(projectId: string): Promise<GradingCriteria[]> {
    return await this.criteriaRepo.findByProjectId(projectId);
  }

  async updateCriteria(criteriaId: string, updateData: Partial<GradingCriteria>): Promise<GradingCriteria | null> {
    return await this.criteriaRepo.update(criteriaId, updateData);
  }

  async deleteCriteria(criteriaId: string): Promise<boolean> {
    return await this.criteriaRepo.delete(criteriaId);
  }

  // Gestion des grilles de notation
  async createGradingGrid(gridData: Partial<GradingGrid>): Promise<GradingGrid> {
    return await this.gridRepo.create(gridData);
  }

  async getGradingGrid(
    projectId: string, 
    groupId: string, 
    type: string, 
    referenceId: string
  ): Promise<GradingGrid | null> {
    return await this.gridRepo.findByParams(projectId, groupId, type as GradingType, referenceId);
  }

  async updateGradingGrid(gridId: string, updateData: Partial<GradingGrid>): Promise<GradingGrid | null> {
    return await this.gridRepo.update(gridId, updateData);
  }

  async validateGradingGrid(gridId: string, teacherId: string): Promise<GradingGrid | null> {
    return await this.gridRepo.update(gridId, {
      isValidated: true,
      gradedBy: teacherId,
      gradedAt: new Date()
    });
  }

  async getProjectGradingGrids(projectId: string): Promise<GradingGrid[]> {
    return await this.gridRepo.findByProjectId(projectId);
  }

  // Calcul des notes finales
  async calculateFinalScore(projectId: string, groupId: string): Promise<number> {
    const grids = await this.gridRepo.findValidatedByProjectAndGroup(projectId, groupId);
    
    if (grids.length === 0) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    for (const grid of grids) {
      const criteria = await this.criteriaRepo.findByReference(projectId, grid.referenceId);

      let gridScore = 0;
      let gridWeight = 0;

      for (const criterion of criteria) {
        const scoreData = grid.criteriaScores.find(s => s.criteriaId === criterion.id);
        if (scoreData) {
          gridScore += (scoreData.score / criterion.maxScore) * criterion.weight;
          gridWeight += criterion.weight;
        }
      }

      if (gridWeight > 0) {
        totalScore += gridScore;
        totalWeight += gridWeight;
      }
    }

    return totalWeight > 0 ? (totalScore / totalWeight) * 20 : 0; // Note sur 20
  }

  // Gestion des notes étudiants
  async updateStudentGrade(projectId: string, studentId: string, groupId: string): Promise<Grade> {
    const finalScore = await this.calculateFinalScore(projectId, groupId);
    
    return await this.gradeRepo.upsert(projectId, studentId, groupId, { finalScore });
  }

  async publishGrades(projectId: string): Promise<void> {
    await this.gradeRepo.publishGradesByProject(projectId);
  }

  async getStudentGrades(studentId: string, projectId: string): Promise<Grade | null> {
    return await this.gradeRepo.findPublishedByStudentAndProject(studentId, projectId);
  }

  async getProjectGrades(projectId: string): Promise<Grade[]> {
    return await this.gradeRepo.findByProjectId(projectId);
  }
}