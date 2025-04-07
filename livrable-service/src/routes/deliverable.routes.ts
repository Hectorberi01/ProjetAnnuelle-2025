import { Router } from 'express';
import { addValidationRule, createDeliverable, deleteDeliverable, deleteValidationRule, getAllDeliverables, getDeliverableById, getDeliverablesByProjectId, getValidationRulesForDeliverable, updateDeliverable, updateValidationRule } from '../controllers/deliverable.controller';

const router = Router();

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

/** Création, modification, mise à jour et suppression d'une règles */
router.post('/:id/rules', addValidationRule); // id du livrable
router.put('/rules/:ruleId', updateValidationRule); // id de la règle
router.delete('/rules/:ruleId', deleteValidationRule);
// router.get('/:id/rules/:ruleId', getValidationRuleById);


/** Soumission d'un livrable */

export default router;