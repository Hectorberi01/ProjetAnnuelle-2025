import { Router } from 'express';
import { GrilleController } from '../controllers/grilleController';
import { NotationController } from '../controllers/notationController';
const router = Router();
const gradingController = new GrilleController();

const notationController = new NotationController();
const grilleController = new GrilleController();

router.get('/:projectId/grilles', grilleController.getGrilles);
router.post('/:projectId/grilles', grilleController.createGrille);
router.put('/grilles/:grilleId', grilleController.updateGrille);
router.delete('/grilles/:grilleId', grilleController.deleteGrille);
router.delete('/:grilleId/criteres/:critereId', grilleController.deleteCritere);
router.post('/grilles/:grilleId/validate', grilleController.validateGrille);

router.get('/:projectId/groups/:groupId/notation', notationController.getNotation);
router.post('/:projectId/groups/:groupId/notation/critere', notationController.saveNoteCritere);
router.post('/:projectId/groups/:groupId/notation/commentaire-global', notationController.saveCommentaireGlobal);
router.post('/:projectId/groups/:groupId/notation/finalize', notationController.finalizeNotation);

router.put('/:projectId/groups/:groupId/notation/critere', notationController.updateNoteCritere);



router.post('/:projectId/groups/:groupId/notation/grilles/:grilleId/validate', notationController.validateSpecificGrille);
router.post('/:projectId/publish', notationController.publishProjectGrades);
router.put('/:grilleId/criteres/:critereId', gradingController.updateCritere);

// Dans votre controller
router.post('/',notationController.saveNotation)
router.post('/:projectId/groups/:groupId/criteres', grilleController.createCritere);

router.get('/:projectId/groups/:groupId/grilles/criteres', grilleController.getGrillesCritere);

router.get('/test', (req, res) => {
  res.send('Grading route OK');
});



// Publier les notes d'un projet (les rendre visibles aux étudiants)


export default router;