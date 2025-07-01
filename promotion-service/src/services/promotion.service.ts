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

  async findByStudentId(studentId: number) {
    const promos = await this.promotionRepo
      .createQueryBuilder("promotion")
      .innerJoinAndSelect("promotion.promotionStudents", "promotionStudent")
      .where("promotionStudent.studentId = :studentId", { studentId })
      .getMany();
    promos.forEach(promo => promo.promotionStudents.forEach(student => delete student.promotion));
    return promos;
    // return this.promotionRepo.find({
    //   relations: ["promotionStudents"],
    //   where: {
    //     promotionStudents: {
    //       studentId: studentId,
    //     },
    //   },
    // });
  }

  async findById(id: number) {
    const promo = await this.promotionRepo.findOne({ where: { id }, relations: ["promotionStudents"] });
    if (!promo) {
      throw new Error("Promotion not found");
    }
    promo.promotionStudents.forEach(student => delete student.promotion);
    return promo;
    // return this.promotionRepo.findOne({
    //   where: { id },  
    //   relations: ["promotionStudents"]
    // });
  }

  async update(id: number, updateData: Partial<Promotion>) {
    await this.promotionRepo.update(id, updateData);
    return this.promotionRepo.findOneBy({ id });
  }

  async delete(id: number) {
    return this.promotionRepo.delete(id);
  }
}