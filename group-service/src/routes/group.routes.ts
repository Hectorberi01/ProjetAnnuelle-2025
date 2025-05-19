import express from 'express';
import { GroupController } from '../controllers/group.controller';

const router = express.Router();

router.get('/', GroupController.getAllGroups);
router.post('/manual', GroupController.createManualGroup);
router.get('/project/:projectId', GroupController.getGroupsByProject);
router.post('/random/:projectId', GroupController.createRandomGroups);
router.post('/free/:projectId', GroupController.createFreeGroups);
router.get('/:id', GroupController.getGroupById);
//router.post('/config', GroupController.setGroupConfig);
//router.put('/config/:projectId', GroupController.updateGroupConfig);
//router.get('/config/:projectId', GroupController.getGroupConfig);
router.post('/addStudent', GroupController.addStudentToGroup);

export default router;
