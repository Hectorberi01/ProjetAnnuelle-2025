import { AppDataSource } from '../config/database';
import { Promotion } from '../entities/Promotion';
import { PromotionDTO } from '../validation/validation';
import { DataSource } from 'typeorm';

export class PromotionService {
  constructor(private dataSource: DataSource) {}
  private repo = AppDataSource.getRepository(Promotion);

  async create(data: PromotionDTO) {
    const promotion = this.repo.create(data);
    return this.repo.save(promotion);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  delete(id: string) {
    return this.repo.delete({ id });
  }
}
