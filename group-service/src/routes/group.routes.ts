import express from 'express';
import { GroupController } from '../controllers/group.controller';

const router = express.Router();

router.get('/', GroupController.getAllGroups);
router.get('/:id', GroupController.getGroupById);
router.post('/', GroupController.createGroup);
router.put('/:id', GroupController.updateGroup);

router.get('/project/:projectId', GroupController.getGroupsByProject);
router.post('/add-student', GroupController.addStudentToGroup);
router.delete('/remove-student', GroupController.removeStudentFromGroup);
router.get('/students/:id', GroupController.getStudentsInGroup);
router.delete('/:id', GroupController.deleteGroup);
router.delete('/project/:projectId', GroupController.deleteGroupsByProject);

export default router;
