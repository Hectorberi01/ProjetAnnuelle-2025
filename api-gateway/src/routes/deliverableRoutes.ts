import { Router } from 'express';
import { downloadDeliverable, getAllDeliverables, getDeliverableById, getDeliverablesByGroup, similarityCheck, similarityMatrix, submitDeliverable } from '../services/deliverableService';
import multer from 'multer';
import { downloadFromS3, uploadPDFToR2 } from '../services/cloudfareService';
import { detectSimilarityForDeliverable } from '../scripts/detectSimilarity';
const router = Router();
const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 Mo
    }
}); 

router.post('/', upload.single('file'),async (req, res) => {
    const { name, description, githubUrl, groupId,projectId } = req.body;
    const file = req.file;
    console.log("Received file:", file);

    if (!file) {
        res.status(400).json({ message: "Le fichier est requis." });
        return;
    }

    const fileUrl = await uploadPDFToR2(file);
    console.log("File uploaded to R2:", fileUrl);

    try {
        //const formData = req.body;
        const deliverable = {
            name,
            description,
            githubUrl,
            groupId: parseInt(groupId),
            projectId: parseInt(projectId),
            fileUrl,
        };

        console.log("Submitting deliverable:", deliverable);

        const result = await submitDeliverable(deliverable);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error submitting deliverable:', error);
        res.status(500).json({ message: 'Failed to submit deliverable', error: error });
    }
});

router.get('/download', async (req, res) => {
    const fileUrl = req.query.url as string;
    console.log("Received request to download file from URL:", fileUrl);
    if (!fileUrl) {
        return res.status(400).json({ message: 'URL manquante dans les paramètres de la requête.' });
    }
    try {
        const fileBuffer = await downloadFromS3(fileUrl);
        res.setHeader('Content-Disposition', `attachment; filename=deliverable-${fileUrl}.zip`);
        res.setHeader('Content-Type', 'application/zip');
        res.send(fileBuffer);
    } catch (error) {
        res.status(500).json({ message: `Failed to download deliverable with ID ${fileUrl}`, error: error });
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
        const result = await detectSimilarityForDeliverable(projectId);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error checking similarity for project ID ${projectId}:`, error);
        res.status(500).json({ message: `Failed to check similarity for project ID ${projectId}`, error: error });
    }
    // try {
    //     const result = await similarityCheck(projectId);
    //     res.status(200).json(result);
    // } catch (error) {
    //     console.error(`Error checking similarity for project ID ${projectId}:`, error);
    //     res.status(500).json({ message: `Failed to check similarity for project ID ${projectId}`, error: error });
    // }
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