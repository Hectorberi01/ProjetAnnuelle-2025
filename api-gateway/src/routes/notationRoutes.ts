import { Router } from 'express';
import { addGradingCriteria, createGrille, deleteGradingCriteria, finalizeGroupNotation, getGradingCriteria, getGradingGridByProjectAndGroup, getGrillesCritere, publishProjectGrades, saveCritereNote, saveGlobalComment, updateGradingCriteria, validateGradingGrid, validateSpecificGrille } from '../services/notationService';

const router = Router();

// --- GRILLES DE NOTATION (avec critères) ---
router.get('/:projectId/grilles', async (req, res) => {
  try {
    const result = await getGradingCriteria(req.params.projectId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des grilles.' });
  }
});

router.post('/:projectId/grilles', async (req, res) => {
  try {
    const result = await addGradingCriteria(req.params.projectId, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la grille.' });
  }
});

router.put('/grilles/:grilleId', async (req, res) => {
  try {
    const result = await updateGradingCriteria(req.params.grilleId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la grille.' });
  }
});

router.get('/:projectId/groups/:groupId/grilles/criteres', async (req, res) => {
  try {
    const result = await getGrillesCritere(req.params.projectId, req.params.groupId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des critères de grille.' });
  }
});

router.post('/:projectId/groups/:groupId/criteres', async (req, res) =>  {
  try {
    const result = await createGrille(req.params.projectId, req.params.groupId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la grille.' });
  }
});




router.delete('/grilles/:grilleId', async (req, res) => {
  try {
    await deleteGradingCriteria(req.params.grilleId);
    res.status(200).json({ message: 'Grille supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la grille.' });
  }
});

router.post('/:projectId/grilles/:grilleId/validate', async (req, res) => {
  try {
    const result = await validateGradingGrid(req.params.grilleId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la validation de la grille.' });
  }
});

// --- NOTATION GROUPE ---
router.get('/:projectId/groups/:groupId/notation', async (req, res) => {
  try {
    const result = await getGradingGridByProjectAndGroup(req.params.projectId, req.params.groupId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la notation.' });
  }
});

router.post('/:projectId/groups/:groupId/notation/critere', async (req, res) => {
  try {
    const result = await saveCritereNote(req.params.projectId, req.params.groupId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la sauvegarde de la note de critère.' });
  }
});

router.post('/:projectId/groups/:groupId/notation/commentaire-global', async (req, res) => {
  try {
    const result = await saveGlobalComment(req.params.projectId, req.params.groupId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du commentaire global.' });
  }
});

router.post('/:projectId/groups/:groupId/notation/finalize', async (req, res) => {
  try {
    const userId = req.body.userId; // À extraire proprement du token plus tard
    const result = await finalizeGroupNotation(req.params.projectId, req.params.groupId, req.body, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la finalisation de la notation.' });
  }
});








router.post('/:projectId/groups/:groupId/notation/grilles/:grilleId/validate', async (req, res) => {
  try {
    const result = await validateSpecificGrille(
      req.params.projectId, 
      req.params.groupId, 
      req.params.grilleId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la validation de la grille.' });
  }
});

// Publier les notes d'un projet (les rendre visibles aux étudiants)
router.post('/:projectId/publish', async (req, res) => {
  try {
    const result = await publishProjectGrades(req.params.projectId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la publication des notes.' });
  }
});




export default router;
