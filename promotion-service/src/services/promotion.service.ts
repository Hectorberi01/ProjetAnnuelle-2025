import { AppDataSource } from "../config/database";
import { Promotion } from "../entities/Promotion";
import { PromotionStudent } from "../entities/PromotionStudent";

export class PromotionService {
  private promotionRepo = AppDataSource.getRepository(Promotion);
  private promotionStudentRepo = AppDataSource.getRepository(PromotionStudent);

  async create(name: string,startYear: Date, endYear: Date) {
    const promo = this.promotionRepo.create({ name, startYear, endYear });
    return this.promotionRepo.save(promo);
  }

  async addStudentToPromotion(promotionId: number, studentId: number) {
    const promo = await this.promotionRepo.findOneBy({ id: promotionId });
    if (!promo) {
      throw new Error("Promotion not found");
    }
    
    const add = this.promotionStudentRepo.create({
      promotionId: promo.id,
      studentId: studentId,
    });
    await this.promotionStudentRepo.save(add);
    return add;
  }

  async findAll() {
    return this.promotionRepo.find({relations: ["promotionStudents"]});
  }

  async findById(id: number) {
    return this.promotionRepo.findOne({
      where: { id },  
      relations: ["promotionStudents"]
    });
  }

  async update(id: number, updateData: Partial<Promotion>) {
    await this.promotionRepo.update(id, updateData);
    return this.promotionRepo.findOneBy({ id });
  }

  async delete(id: number) {
    return this.promotionRepo.delete(id);
  }
}