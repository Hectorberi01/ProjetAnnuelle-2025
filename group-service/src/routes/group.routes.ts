import express from 'express';
import { GroupController } from '../controllers/group.controller';

const router = express.Router();

router.post('/manual', GroupController.createManualGroup);
router.get('/project/:projectId', GroupController.getGroupsByProject);
router.post('/random/:projectId', GroupController.createRandomGroups);
router.post('/config', GroupController.setGroupConfig);
router.put('/config/:projectId', GroupController.updateGroupConfig);
router.get('/config/:projectId', GroupController.getGroupConfig);

export default router;
