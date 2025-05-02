import { DataSource } from 'typeorm';
import { Group } from '../entities/Group';
import { GroupConfig } from '../entities/GroupConfig';
import { GroupStudent } from '../entities/groupeStudent';

export class GroupService {
  constructor(private dataSource: DataSource) {}

  private groupRepo = this.dataSource.getRepository(Group);
  private configRepo = this.dataSource.getRepository(GroupConfig);
  private groupStudentRepo = this.dataSource.getRepository(GroupStudent);

  async getAllGroups() {
    return await this.groupRepo.find({
      relations: {
        groupStudent: true,
      },
    });
  }

  async createManualGroup(projectId: number, name:string) {
    // on récupère la config du projet
    const config = await this.configRepo.findOneBy({ projectId });

    if (!config) throw new Error('GroupConfig not found');

    // on vérifie si le nom du groupe est unique
    const existingGroup = await this.groupRepo.findOneBy({ name, projectId });
    if (existingGroup) throw new Error('Group name already exists');

    const group = this.groupRepo.create({ projectId, name });
    return this.groupRepo.save(group);
  }

  async getGroupsByProject(projectId: number) {
    return this.groupRepo.find({ where: { projectId } });
  }

  async createRandomGroups(projectId: number, name: string) {
    const config = await this.configRepo.findOneBy({ projectId });
    if (!config) throw new Error('GroupConfig not found');

    const group = this.groupRepo.create({ projectId, name });
    return await this.groupRepo.save(group);
  }

  async setGroupConfig(config: Partial<GroupConfig>) {
    const existing = await this.configRepo.findOneBy({ projectId: config.projectId });
    if (existing) {
      return this.configRepo.save({ ...existing, ...config });
    }
    return this.configRepo.save(this.configRepo.create(config));
  }

  async updateGroupConfig(projectId: number, config: Partial<GroupConfig>) {
    const existing = await this.configRepo.findOneBy({ projectId });
    if (!existing) throw new Error('GroupConfig not found');
    return this.configRepo.save({ ...existing, ...config });
  }

  async getGroupConfig(projectId: number) {
    return this.configRepo.findOneBy({ projectId });
  }

  async addStudentToGroup(groupId: number, studentId: number) {
    const group = await this.groupRepo.findOneBy({ id: groupId });
    if (!group) throw new Error('Group not found');

    const groupStudent = this.groupStudentRepo.create({studentId, createdAt: new Date(), groupStudent: group});
    return this.groupStudentRepo.save(groupStudent);
  }
}
