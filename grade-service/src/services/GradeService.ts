// services/GradeService.ts
import { AppDataSource } from "../config/database";
import { Grade } from "../entities/Grade";
import { GradeCriterion } from "../entities/GradeCriterion";
import { GradeComment } from "../entities/GradeComment";

export class GradeService {
  private gradeRepo = AppDataSource.getRepository(Grade);
  private commentRepo = AppDataSource.getRepository(GradeComment);
  private criterionRepo = AppDataSource.getRepository(GradeCriterion);

  async submitGrades(gridId: number, groupId: number, grades: { criterionId: number, score: number, comment?: string }[]) {
    const gradeEntities = grades.map(g =>
      this.gradeRepo.create({
        criterion: { id: g.criterionId } as GradeCriterion,
        groupId : groupId,
        score: g.score,
        comment: g.comment
      })
    );
    return await this.gradeRepo.save(gradeEntities);
  }

  async addGlobalComment(gridId: number, groupId: number, content: string) {
    const comment = this.commentRepo.create({
      grid: { id: gridId },
      groupId: groupId,
      content
    });
    return await this.commentRepo.save(comment);
  }

  async getGradesForGroup(groupId: number) {
    return await this.gradeRepo.find({
      where: { groupId:  groupId } ,
      relations: ['criterion', 'criterion.grid']
    });
  }
}