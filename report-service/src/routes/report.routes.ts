import { Router } from "express";
import { create, deleteReport, getAll, getByGroup, getById, getByProject, update } from "../controllers/report.controller";
//import { createSection, getSections, updateSection } from "../controllers/report-section.controller";

const router = Router();

// Créer un rapport
router.post('/', create);

// mettre à jour un rapport
router.put('/:id', update);

// Récupérer tous les rapports
router.get('/', getAll);

// Récupérer un rapport par son ID
router.get('/:id', getById);

// Récupérer tous les rapports d'un projet
router.get('/projects/:projectId', getByProject);

// suppression d'un rapport
router.delete('/:id', deleteReport);

// Récupérer tous les rapports d'un groupe
router.get('/groups/:groupId', getByGroup);

export default router;