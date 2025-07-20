"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const grilleController_1 = require("../controllers/grilleController");
const notationController_1 = require("../controllers/notationController");
const router = (0, express_1.Router)();
const gradingController = new grilleController_1.GrilleController();
const notationController = new notationController_1.NotationController();
const grilleController = new grilleController_1.GrilleController();
router.get('/:projectId/grilles', grilleController.getGrilles);
router.post('/:projectId/grilles', grilleController.createGrille);
router.put('/grilles/:grilleId', grilleController.updateGrille);
router.delete('/grilles/:grilleId', grilleController.deleteGrille);
router.post('/grilles/:grilleId/validate', grilleController.validateGrille);
router.get('/:projectId/groups/:groupId/notation', notationController.getNotation);
router.post('/:projectId/groups/:groupId/notation/critere', notationController.saveNoteCritere);
router.post('/:projectId/groups/:groupId/notation/commentaire-global', notationController.saveCommentaireGlobal);
router.post('/:projectId/groups/:groupId/notation/finalize', notationController.finalizeNotation);
router.post('/:projectId/groups/:groupId/notation/grilles/:grilleId/validate', notationController.validateSpecificGrille);
router.post('/:projectId/publish', notationController.publishProjectGrades);
// Dans votre controller
router.post('/:projectId/groups/:groupId/criteres', grilleController.createCritere);
router.get('/:projectId/groups/:groupId/grilles/criteres', grilleController.getGrillesCritere);
router.get('/test', (req, res) => {
    res.send('Grading route OK');
});
// Publier les notes d'un projet (les rendre visibles aux étudiants)
exports.default = router;
