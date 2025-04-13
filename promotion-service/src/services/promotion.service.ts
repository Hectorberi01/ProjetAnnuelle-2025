import { AppDataSource } from "../config/database";
import { Promotion } from "../entities/Promotion";

export class PromotionService {
  private promotionRepo = AppDataSource.getRepository(Promotion);

  async create(name: string, year: number) {
    const promo = this.promotionRepo.create({ name, year });
    return this.promotionRepo.save(promo);
  }

  async findAll() {
    return this.promotionRepo.find();
  }

  async findById(id: number) {
    return this.promotionRepo.findOneBy({ id });
  }

  async update(id: number, updateData: Partial<Promotion>) {
    await this.promotionRepo.update(id, updateData);
    return this.promotionRepo.findOneBy({ id });
  }

  async delete(id: number) {
    return this.promotionRepo.delete(id);
  }
}