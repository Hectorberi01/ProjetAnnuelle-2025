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

  async getGroupById(id: number) {
    return await this.groupRepo.findOne({
      where: { id },
      relations: {
        groupStudent: true,
      },
    });
  }
  async createManualGroup(projectId: number, name:string) {

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

    const group = this.groupRepo.create({ projectId, name });
    return await this.groupRepo.save(group);
  }
  async createFreeGroups(projectId: number, name: string) {
    const group = this.groupRepo.create({ projectId, name });
    return await this.groupRepo.save(group);
  }

  async addStudentToGroup(groupId: number, studentId: number) {
    const group = await this.groupRepo.findOneBy({ id: groupId });
    if (!group) throw new Error('Group not found');

    const groupStudent = this.groupStudentRepo.create({studentId, createdAt: new Date(), groupStudent: group});
    return this.groupStudentRepo.save(groupStudent);
  }
}
