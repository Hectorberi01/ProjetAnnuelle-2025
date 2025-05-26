import { Request, Response } from 'express';
import { GroupService } from '../services/group.service';
import { AppDataSource } from '../config/database';
import { manualGroupSchema, groupConfigSchema } from '../validation/validation';

const service = new GroupService(AppDataSource);
export class GroupController {

    static async getAllGroups(req: Request, res: Response) {
      try {
        console.log('Fetching all groups');
        const groups = await service.getAllGroups();
        console.log(groups);
        res.status(200).json(groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }

    static async getGroupById(req: Request, res: Response) {
        const groupId = parseInt(req.params.id);
        try {
          const group = await service.getGroupById(groupId);
          if (!group) {
              res.status(404).json({ message: 'Group not found' });
              return;
          }
          res.status(200).json(group);
        } catch (error) {
          console.error('Error fetching group by ID:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async createGroup(req: Request, res: Response) {
        console.log('Creating group');
        console.log(req.body);
        const {projectId,name} = req.body;

        try {
            const group = await service.createGroup(projectId, name);
            if (!group) {
              res.status(400).json({ message: 'Group creation failed' });
              return;
            }
            res.status(201).json({message : 'Group created successfully'});

        } catch (e) {
            res.status(400).json({ message: 'Group creation failed' });
        }
    }


  
    static async getGroupsByProject(req: Request, res: Response) {
      try {
        console.log('Fetching groups by project');

        console.log(req.params.projectId);

        if (!req.params.projectId) {
          res.status(400).json({ error: 'Project ID is required' });
          return;
        }
        const projectId = parseInt(req.params.projectId);

        const groups = await service.getGroupByProjectId(projectId);

        res.status(200).json(groups);
      } catch (error) {
        console.error('Error fetching groups by project:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  
    static async updateGroup(req: Request, res: Response) {
      const groupId = parseInt(req.params.id);
      const { name } = req.body;
  
      try {
        const updatedGroup = await service.updateGroup(groupId, name);
        if (!updatedGroup) {
          res.status(404).json({ message: 'Group not found' });
          return;
        }
        res.status(200).json(updatedGroup);
      } catch (e) {
        res.status(400).json({ error: e });
      }
    }

    static async getStudentsInGroup(req: Request, res: Response) {
      const groupId = parseInt(req.params.id);
      try {
        const students = await service.getStudentsInGroup(groupId);
        if (!students) {
          res.status(404).json({ message: 'No students found in this group' });
          return;
        }
        res.status(200).json(students);
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

    static async removeStudentFromGroup(req: Request, res: Response) {
      const { groupId, studentId } = req.body;
      try {
        const result = await service.removeStudentFromGroup(groupId, studentId);
        res.status(200).json(result);
      } catch (e) {
        res.status(400).json({ error: e });
      }
    }
    
    static async deleteGroup(req: Request, res: Response) {
      const groupId = parseInt(req.params.id);
      try {
        const result = await service.deleteGroup(groupId);
        if (!result) {
          res.status(404).json({ message: 'Group not found' });
          return;
        }
        res.status(200).json({ message: 'Group deleted successfully' });
      } catch (e) {
        res.status(400).json({ error: e });
      }
    }
  }
  