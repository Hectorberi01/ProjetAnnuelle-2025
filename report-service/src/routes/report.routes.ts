import { Router } from "express";
import { create, getReportById, getReports } from "../controllers/report.controller";
import { createSection, getSections, updateSection } from "../controllers/report-section.controller";

const router = Router();

router.post('/', create);
router.get('/project/:projectId',getReports);
router.get('/:id', getReportById);

router.post('/sections', createSection);
router.put('/sections/:id', updateSection);
router.get('/sections/:id', getSections);

export default router;