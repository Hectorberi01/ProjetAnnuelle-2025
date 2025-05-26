import { DataSource } from 'typeorm';
import { Group } from '../entities/Group';
import { GroupConfig } from '../entities/GroupConfig';
import { GroupStudent } from '../entities/groupeStudent';

export class GroupService {
  constructor(private dataSource: DataSource) {}

  private groupRepo = this.dataSource.getRepository(Group);
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

  async getGroupByProjectId(projectId: number) {
    return await this.groupRepo.find({
      where: { projectId },
      relations: {
        groupStudent: true,
      },
    });
  }

  async createGroup(projectId: number, name:string) {
    // on vérifie si le nom du groupe est unique
    const existingGroup = await this.groupRepo.findOneBy({ name, projectId });
    if (existingGroup) throw new Error('Group name already exists');

    const group = this.groupRepo.create({ projectId, name });
    return this.groupRepo.save(group);
  }


  async updateGroup(id: number, name: string) {
    const group = await this.groupRepo.findOneBy({ id });
    if (!group) throw new Error('Group not found');

    group.name = name;
    return this.groupRepo.save(group);
  }

  async addStudentToGroup(groupId: number, studentId: number) {
    const group = await this.groupRepo.findOneBy({ id: groupId });
    if (!group) throw new Error('Group not found');

    const groupStudent = this.groupStudentRepo.create({studentId, createdAt: new Date(), groupStudent: group});
    return this.groupStudentRepo.save(groupStudent);
  }

  async getStudentsInGroup(groupId: number) {
    return await this.groupStudentRepo.find({
      where: { groupStudent: { id: groupId } },
      relations: {
        groupStudent: true,
      },
    });
  }

  async removeStudentFromGroup(groupId: number, studentId: number) {
    const groupStudent = await this.groupStudentRepo.findOne({
      where: { groupStudent: { id: groupId }, studentId },
    });

    if (!groupStudent) throw new Error('Group student not found');

    return this.groupStudentRepo.remove(groupStudent);
  }

  async deleteGroup(id: number) {
    const group = await this.groupRepo.findOneBy({ id });
    if (!group) throw new Error('Group not found');

    return this.groupRepo.remove(group);
  }
}
