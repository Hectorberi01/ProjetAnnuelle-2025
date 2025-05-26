

//routes
import { Router } from "express";
import { ProjectController } from "../controllers/projet.controller";


const router = Router();
// Récupérer tous les projets
router.get("/", ProjectController.getAllProjects);

// Récupérer un projet par ID
router.get("/:id", ProjectController.getProjectById);

// Récupérer les projets par promotion
router.get("/promotion/:promotionId", ProjectController.getProjectsByPromotionId);

// ➕ Créer un projet
router.post("/", ProjectController.createProject);

// Mettre à jour un projet
router.put("/:id", ProjectController.updateProject);

// Supprimer un projet
router.delete("/:id", ProjectController.deleteProject);

// Mettre à jour le statut d'un projet
router.patch("/:id/status", ProjectController.updateProjectStatus);

// Mettre à jour le mode d'un projet
router.patch("/:id/mode", ProjectController.updateProjectMode);

// Mettre à jour la date de soutenance d'un projet
router.patch("/:id/soutenance-date", ProjectController.updateSoutenanceDate);

// Mettre à jour le retard d'un projet
router.patch("/:id/late-policy", ProjectController.updateProjectLatePolicy);

// Exporter le routeur
export default router;
