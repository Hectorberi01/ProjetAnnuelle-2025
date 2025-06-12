"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const deliverable_controller_1 = require("../controllers/deliverable.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    dest: 'uploads/'
});
router.post('/', upload.single('file'), deliverable_controller_1.submitDeliverable);
router.get('/:id/download', deliverable_controller_1.downloadDeliverable);
// All livrable routes
router.get('/', deliverable_controller_1.getAllDeliverables);
router.get('/:id', deliverable_controller_1.getDeliverableById);
router.get('/project/:id', deliverable_controller_1.getDeliverablesByProjectId);
router.get('/groups/:groupId', deliverable_controller_1.getDeliverablesByGroupId);
router.post('/internal/similarity-check/project/:projectId', deliverable_controller_1.similarityCheck);
router.get('/projects/:projectId/similarity-matrix', deliverable_controller_1.similarityMatrix);
exports.default = router;
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
