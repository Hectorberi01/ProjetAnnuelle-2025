import { DataSource } from 'typeorm';
import { Group } from '../entities/Group';
import { GroupConfig } from '../entities/GroupConfig';

export class GroupService {
  constructor(private dataSource: DataSource) {}

  private groupRepo = this.dataSource.getRepository(Group);
  private configRepo = this.dataSource.getRepository(GroupConfig);

  async createManualGroup(projectId: number, studentIds: number[]) {
    const config = await this.configRepo.findOneBy({ projectId });
    if (!config) throw new Error('GroupConfig not found');
    if (studentIds.length < config.minSize || studentIds.length > config.maxSize) {
      throw new Error(`Group size must be between ${config.minSize} and ${config.maxSize}`);
    }
    const group = this.groupRepo.create({ projectId, studentIds });
    return this.groupRepo.save(group);
  }

  async getGroupsByProject(projectId: number) {
    return this.groupRepo.find({ where: { projectId } });
  }

  async createRandomGroups(projectId: number, studentIds: number[]) {
    const config = await this.configRepo.findOneBy({ projectId });
    if (!config) throw new Error('GroupConfig not found');

    const { minSize, maxSize } = config;
    const shuffled = [...studentIds].sort(() => Math.random() - 0.5);
    const createdGroups: Group[] = [];

    while (shuffled.length > 0) {
      const groupSize = Math.min(maxSize, shuffled.length);
      const members = shuffled.splice(0, groupSize);
      const group = this.groupRepo.create({ projectId, studentIds: members });
      await this.groupRepo.save(group);
      createdGroups.push(group);
    }

    return createdGroups;
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
}
