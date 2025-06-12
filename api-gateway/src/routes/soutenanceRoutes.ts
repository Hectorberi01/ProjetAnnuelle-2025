import { Router } from "express";
import { generateSoutenanceSchedule, getSoutenanceSchedule, updateSoutenanceSlot } from "../services/soutenanceService";

const router = Router();

router.post('/', async (req, res) => {
    try {
        const schedules = await generateSoutenanceSchedule(req.body);
        res.status(201).json(schedules);    
    } catch (e) {       
        console.error('Error generating schedule:', e);
        res.status(500).json({ message: 'Erreur de génération', error: e });
    }
});
router.get('/:projectId', async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    try {
        // Call the service to get the schedule
        const schedules = await getSoutenanceSchedule(projectId);
        res.status(200).json(schedules);
    } catch (e) {
        console.error('Error fetching schedule:', e);
        res.status(500).json({ message: 'Erreur de récupération', error: e });
    }
});
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const data = req.body;
    try {
        const updated = await updateSoutenanceSlot(id, data);
        res.status(200).json(updated);
    } catch (e) {
        console.error('Error updating slot:', e);
        res.status(500).json({ message: 'Erreur de mise à jour', error: e });
    }
});

export default router;

