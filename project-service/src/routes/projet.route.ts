

//routes
import { Router } from "express";
import { ProjectController } from "../controllers/projet.controller";


const router = Router();
// ➕ Créer un projet
router.post("/", ProjectController.createProject);

// Récupérer tous les projets
router.get("/", ProjectController.getAllProjects);
// Récupérer les projets par promotion
router.get("/promotion/:promotionId", ProjectController.getProjectsByPromotion);
// Récupérer un projet par ID
router.get("/:id", ProjectController.getProjectById);
// Mettre à jour un projet
router.put("/:id", ProjectController.updateProject);
// Supprimer un projet
router.delete("/:id", ProjectController.deleteProject);
// Exporter le routeur
export default router;
