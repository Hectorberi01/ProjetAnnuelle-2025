import { Request, Response } from 'express';
import { GroupService } from '../services/group.service';
import { AppDataSource } from '../config/database';
import { manualGroupSchema, groupConfigSchema } from '../validation/validation';

const service = new GroupService(AppDataSource);
export class GroupController {

    static async getAllGroups(req: Request, res: Response) {
        const groups = await service.getAllGroups();
        console.log(groups);
        res.status(200).json(groups);
    }
    static async getGroupById(req: Request, res: Response) {
        const groupId = parseInt(req.params.id);
        const group = await service.getGroupById(groupId);
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        res.status(200).json(group);
    }

    static async createManualGroup(req: Request, res: Response) {
        console.log('Creating manual group');
        console.log(req.body);
        const { error, value } = manualGroupSchema.validate(req.body);
        if (error)  res.status(400).json({ error: error.details });
    
        try {
            const group = await service.createManualGroup(value.projectId, value.studentIds);
            res.status(201).json(group);
        } catch (e) {
            res.status(400).json({ error: e });
        }
    }
  
    static async getGroupsByProject(req: Request, res: Response) {
      const projectId = parseInt(req.params.projectId);
      const groups = await service.getGroupsByProject(projectId);
      res.status(200).json(groups);
    }
  
    static async createRandomGroups(req: Request, res: Response) {
      const projectId = parseInt(req.params.projectId);
      const { name } = req.body;
  
      try {
        const result = await service.createRandomGroups(projectId, name);
        res.status(201).json(result);
      } catch (e) {
        res.status(400).json({ error: e });
      }
    }
    static async createFreeGroups(req: Request, res: Response) {
      const projectId = parseInt(req.params.projectId);
      const { name } = req.body;
  
      try {
        const result = await service.createFreeGroups(projectId, name);
        res.status(201).json(result);
      } catch (e) {
        res.status(400).json({ error: e });
      }
    }


    static async addStudentToGroup(req: Request, res: Response) {
      const { groupId, studentId } = req.body;
      try {
        const result = await service.addStudentToGroup(groupId, studentId);
        res.status(201).json(result);
      } catch (e) {
        res.status(400).json({ error: e });
      }
    }
  }
  