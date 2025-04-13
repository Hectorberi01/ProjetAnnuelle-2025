import { AppDataSource } from "../database/database";
import { Role } from "../database/entities/Role";

export class RoleService {
  private roleRepo = AppDataSource.getRepository(Role);

  // RoleCreate
  async create(data: { name: string }): Promise<Role> {
    const role = this.roleRepo.create(data);
    return this.roleRepo.save(role);
  }

  // RoleList
  async findAll(): Promise<Role[]> {
    return this.roleRepo.find({ relations: ["users"] });
  }

  // RoleUpdate
  async update(id: number, data: Partial<Role>): Promise<Role | null> {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) return null;

    Object.assign(role, data);
    return this.roleRepo.save(role);
  }

  // RoleDelete
  async delete(id: number): Promise<boolean> {
    const result = await this.roleRepo.delete(id);
    return result.affected !== 0;
  }
}
