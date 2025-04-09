import { Request, Response } from 'express';
import { GroupService } from '../services/group.service';
import { AppDataSource } from '../config/database';
import { manualGroupSchema, groupConfigSchema } from '../validation/validation';

const service = new GroupService(AppDataSource);
export class GroupController {
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
      const { studentIds } = req.body;
  
      if (!Array.isArray(studentIds) || studentIds.length === 0) {
        res.status(400).json({ error: 'Invalid request body' });
        return;
      }
  
      try {
        const result = await service.createRandomGroups(projectId, studentIds);
        res.status(201).json(result);
      } catch (e) {
        res.status(400).json({ error: e });
      }
    }
  
    static async setGroupConfig(req: Request, res: Response) {
        console.log('Setting group config');
        const { error, value } = groupConfigSchema.validate(req.body);
        if (error)  res.status(400).json({ error: error.details });
    
        const config = await service.setGroupConfig(value);
        res.status(201).json(config);
    }

    static async updateGroupConfig(req: Request, res: Response) {
      const { error, value } = groupConfigSchema.validate(req.body);
      if (error)  res.status(400).json({ error: error.details });
  
      const config = await service.updateGroupConfig(parseInt(req.params.projectId), value);
      if (!config)  res.status(404).json({ error: 'Config not found' });
      res.status(200).json(config);
    }
  
    static async getGroupConfig(req: Request, res: Response) {
      const config = await service.getGroupConfig(parseInt(req.params.projectId));
      if (!config)  res.status(404).json({ error: 'Config not found' });
      res.status(200).json(config);
    }
  }
  