import { Router } from 'express';
import { downloadDeliverable, getAllDeliverables, getDeliverableById, getDeliverablesByGroup, similarityCheck, similarityMatrix, submitDeliverable } from '../services/deliverableService';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const formData = req.body; // Assuming the body contains FormData
        const result = await submitDeliverable(formData);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error submitting deliverable:', error);
        res.status(500).json({ message: 'Failed to submit deliverable', error: error });
    }
});

router.get('/:id/download', async (req, res) => {
    const deliverableId = parseInt(req.params.id);
    try {
        const blob = await downloadDeliverable(deliverableId);
        res.setHeader('Content-Disposition', `attachment; filename=deliverable-${deliverableId}.zip`);
        res.setHeader('Content-Type', 'application/zip');
        res.send(blob);
    } catch (error) {
        console.error(`Error downloading deliverable with ID ${deliverableId}:`, error);
        res.status(500).json({ message: `Failed to download deliverable with ID ${deliverableId}`, error: error });
    }
});

router.get('/', async (req, res) => {
    try {
        const deliverables = await getAllDeliverables();
        res.status(200).json(deliverables);
    } catch (error) {
        console.error('Error fetching deliverables:', error);
        res.status(500).json({ message: 'Failed to fetch deliverables', error: error });
    }
});

router.get('/:id', async (req, res) => {
    const deliverableId = parseInt(req.params.id);
    try {
        const deliverable = await getDeliverableById(deliverableId);
        res.status(200).json(deliverable);
    } catch (error) {
        console.error(`Error fetching deliverable with ID ${deliverableId}:`, error);
        res.status(500).json({ message: `Failed to fetch deliverable with ID ${deliverableId}`, error: error });
    }
});

router.get('/groups/:groupId', async (req, res) => {
    const groupId = parseInt(req.params.groupId);
    try {
        const deliverables = await getDeliverablesByGroup(groupId);
        res.status(200).json(deliverables);
    } catch (error) {
        console.error(`Error fetching deliverables for group ID ${groupId}:`, error);
        res.status(500).json({ message: `Failed to fetch deliverables for group ID ${groupId}`, error: error });
    }
});

router.post('/internal/similarity-check/project/:projectId', async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    try {
        const result = await similarityCheck(projectId);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error checking similarity for project ID ${projectId}:`, error);
        res.status(500).json({ message: `Failed to check similarity for project ID ${projectId}`, error: error });
    }
});

router.get('/projects/:projectId/similarity-matrix', async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    try {
        const matrix = await similarityMatrix(projectId);
        res.status(200).json(matrix);
    } catch (error) {
        console.error(`Error fetching similarity matrix for project ID ${projectId}:`, error);
        res.status(500).json({ message: `Failed to fetch similarity matrix for project ID ${projectId}`, error: error });
    }
});

export default router;