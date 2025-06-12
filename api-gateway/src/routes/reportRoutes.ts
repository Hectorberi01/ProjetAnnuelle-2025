import { Router } from "express";

import { createReport, deleteReport, getAllReports, getReportByGroup, getReportById, getReportByProject, updateReport } from "../services/reportService";

const router = Router();

// Créer un rapport
router.post('/', async (req, res) => {
    try {
        const report = req.body;
        const createdReport = await createReport(report);
        res.status(201).json(createdReport);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: "Failed to create report" });
    }
});

// All reports
router.get('/', async (req, res) => {
    try {
        const reports = await getAllReports();
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
});

// Get report by project
router.get('/projects/:projectId', async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    try {
        const reports = await getReportByProject(projectId);
        if (reports.length === 0) {
            res.status(404).json({ message: "No reports found for this project" });
            return;
        }
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
});

// Get report by group
router.get('/groups/:groupId', async (req, res) => {
    const groupId = parseInt(req.params.groupId);
    console.log("Fetching reports for group ID:", groupId);
    try {
        const reports = await getReportByGroup(groupId);
        if (reports.length === 0) {
            res.status(404).json({ message: "No reports found for this group" });
            return;
        }
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
});

// Get report by ID
router.get('/:reportId', async (req, res) => {
    const reportId = parseInt(req.params.reportId);
    try {
        const report = await getReportById(reportId);
        if (!report) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(200).json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: "Failed to fetch report" });
    }
});

// Update report
router.put('/:reportId', async (req, res) => {
    const reportId = parseInt(req.params.reportId);
    const report = req.body;
    try {
        const updatedReport = await updateReport(reportId, report);
        if (!updatedReport) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(200).json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: "Failed to update report" });
    }
});
// Delete report
router.delete('/:reportId', async (req, res) => {
    const reportId = parseInt(req.params.reportId);
    try {
        const deletedReport = await deleteReport(reportId);
        if (!deletedReport) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: "Failed to delete report" });
    }
});

export default router;