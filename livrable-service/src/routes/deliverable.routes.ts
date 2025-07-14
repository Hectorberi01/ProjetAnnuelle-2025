import { Router } from 'express';
import e, { Request, Response } from 'express';
import multer from 'multer';
import { downloadDeliverable, getAllDeliverables, getDeliverableById, getDeliverablesByGroupId, getDeliverablesByProjectId, similarityCheck, similarityMatrix, submitDeliverable } from '../controllers/deliverable.controller';
import { get } from 'http';

import { detectSimilarityForDeliverable } from '../scripts/detectSimilarity';


const router = Router();

// const upload = multer({
//   dest: 'uploads/'
// });

const upload = multer()

//router.post('/', upload.single('file'), submitDeliverable);
router.post('/', upload.none(), submitDeliverable);
router.get('/:id/download', downloadDeliverable);

// All livrable routes
router.get('/', getAllDeliverables);
router.get('/:id', getDeliverableById);
router.get('/project/:id', getDeliverablesByProjectId);
router.get('/groups/:groupId', getDeliverablesByGroupId);

router.post('/internal/similarity-check/project/:projectId', similarityCheck);
router.get('/projects/:projectId/similarity-matrix', similarityMatrix);

export default router;



/*
// Créer un livrable
router.post('/', createDeliverable);

// Récupérer tous les livrables
router.get('/', getAllDeliverables);

// Récupérer un livrable par ID
router.get('/:id', getDeliverableById);

// Récupérer les livrables par ID de projet
router.get('/project/:id', getDeliverablesByProjectId);

// Mettre à jour un livrable par ID
router.put('/:id', updateDeliverable);

// Supprimer un livrable par ID
router.delete('/:id',deleteDeliverable);

// Récupérer les règles d'un livrable par ID
router.get('/:id/rules', getValidationRulesForDeliverable); // id du livrable

router.post('/:id/rules', addValidationRule); // id du livrable
router.put('/rules/:ruleId', updateValidationRule); // id de la règle
router.delete('/rules/:ruleId', deleteValidationRule);
// router.get('/:id/rules/:ruleId', getValidationRuleById);


/** Soumission d'un livrable */