import { Request, Response } from 'express';
import { SoutenanceService } from '../services/soutenanceService';


export class SoutenanceController {
  static async generate(req: Request, res: Response) {
    console.log('Generating schedule with data:', req.body);
    try {
      const schedules = await SoutenanceService.generateSchedule(req.body);
      res.status(201).json(schedules);
    } catch (e) {
      res.status(500).json({ message: 'Erreur de génération', error: e });
    }
  }

  static async get(req: Request, res: Response) {
    const projectId = parseInt(req.params.projectId);
    const schedules = await SoutenanceService.getSchedule(projectId);
    res.json(schedules);
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updated = await SoutenanceService.updateSlot(id, data);
    res.json(updated);
  }
}