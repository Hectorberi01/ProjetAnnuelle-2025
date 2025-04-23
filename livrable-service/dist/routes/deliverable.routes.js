"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deliverable_controller_1 = require("../controllers/deliverable.controller");
const router = (0, express_1.Router)();
// Créer un livrable
router.post('/', deliverable_controller_1.createDeliverable);
// Récupérer tous les livrables
router.get('/', deliverable_controller_1.getAllDeliverables);
// Récupérer un livrable par ID
router.get('/:id', deliverable_controller_1.getDeliverableById);
// Récupérer les livrables par ID de projet
router.get('/project/:id', deliverable_controller_1.getDeliverablesByProjectId);
// Mettre à jour un livrable par ID
router.put('/:id', deliverable_controller_1.updateDeliverable);
// Supprimer un livrable par ID
router.delete('/:id', deliverable_controller_1.deleteDeliverable);
// Récupérer les règles d'un livrable par ID
router.get('/:id/rules', deliverable_controller_1.getValidationRulesForDeliverable); // id du livrable
/** Création, modification, mise à jour et suppression d'une règles */
router.post('/:id/rules', deliverable_controller_1.addValidationRule); // id du livrable
router.put('/rules/:ruleId', deliverable_controller_1.updateValidationRule); // id de la règle
router.delete('/rules/:ruleId', deliverable_controller_1.deleteValidationRule);
// router.get('/:id/rules/:ruleId', getValidationRuleById);
/** Soumission d'un livrable */
exports.default = router;
