"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//routes
const express_1 = require("express");
const projet_controller_1 = require("../controllers/projet.controller");
const router = (0, express_1.Router)();
// ➕ Créer un projet
router.post("/", projet_controller_1.ProjectController.createProject);
// Récupérer tous les projets
router.get("/", projet_controller_1.ProjectController.getAllProjects);
// Récupérer les projets par promotion
router.get("/promotion/:promotionId", projet_controller_1.ProjectController.getProjectsByPromotion);
// Récupérer un projet par ID
router.get("/:id", projet_controller_1.ProjectController.getProjectById);
// Mettre à jour un projet
router.put("/:id", projet_controller_1.ProjectController.updateProject);
// Supprimer un projet
router.delete("/:id", projet_controller_1.ProjectController.deleteProject);
// Exporter le routeur
exports.default = router;
