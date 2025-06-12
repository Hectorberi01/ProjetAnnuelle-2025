"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//routes
const express_1 = require("express");
const projet_controller_1 = require("../controllers/projet.controller");
const router = (0, express_1.Router)();
// Récupérer tous les projets
router.get("/", projet_controller_1.ProjectController.getAllProjects);
// Récupérer un projet par ID
router.get("/:id", projet_controller_1.ProjectController.getProjectById);
// Récupérer les projets par promotion
router.get("/promotion/:promotionId", projet_controller_1.ProjectController.getProjectsByPromotionId);
// ➕ Créer un projet
router.post("/", projet_controller_1.ProjectController.createProject);
// Mettre à jour un projet
router.put("/:id", projet_controller_1.ProjectController.updateProject);
// Supprimer un projet
router.delete("/:id", projet_controller_1.ProjectController.deleteProject);
// Mettre à jour le statut d'un projet
router.patch("/:id/status", projet_controller_1.ProjectController.updateProjectStatus);
// Mettre à jour le mode d'un projet
router.patch("/:id/mode", projet_controller_1.ProjectController.updateProjectMode);
// Mettre à jour la date de soutenance d'un projet
router.patch("/:id/soutenance-date", projet_controller_1.ProjectController.updateSoutenanceDate);
// Mettre à jour le retard d'un projet
router.patch("/:id/late-policy", projet_controller_1.ProjectController.updateProjectLatePolicy);
// ajouter les informations de la soutenace
router.post("/:id/soutenance", projet_controller_1.ProjectController.addSoutenance);
// Mettre à jour les informations de la soutenance
router.put("/:id/soutenance", projet_controller_1.ProjectController.updateSoutenance);
// Exporter le routeur
exports.default = router;
