import { Router } from 'express';
import e, { Request, Response } from 'express';
import multer from 'multer';
import { getAllDeliverables, getDeliverableById, getDeliverablesByGroupId, getDeliverablesByProjectId, SimilarityCheck, similarityMatrix, submitDeliverable } from '../controllers/deliverable.controller';
import { get } from 'http';

import { detectSimilarityForDeliverable } from '../scripts/detectSimilarity';


const router = Router();

// const upload = multer({
//   dest: 'uploads/'
// });

const upload = multer()

//router.post('/', upload.single('file'), submitDeliverable);
router.post('/', upload.none(), submitDeliverable);
//router.get('/:id/download', downloadDeliverable);

// All livrable routes
router.get('/', getAllDeliverables);
router.get('/:id', getDeliverableById);
router.get('/project/:id', getDeliverablesByProjectId);
router.get('/groups/:groupId', getDeliverablesByGroupId);
router.post('/similarity', SimilarityCheck);

//router.post('/internal/similarity-check/project/:projectId', similarityCheck);
router.get('/projects/:projectId/similarity-matrix', similarityMatrix);

export default router;

