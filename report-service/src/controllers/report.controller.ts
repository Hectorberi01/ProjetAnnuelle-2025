import e, { Request, Response } from 'express';
import { ReportService } from '../services/report.service';

const reportService = new ReportService();

// Create a new report
export const  create = async (req:Request, res:Response)=> {
    console.log('Creating report');
    console.log(req.body);
    const response = await reportService.createReport(req.body);
    if (!response) {
        res.status(404).json({ message: 'Report not created' });
        return;
    }
    res.status(201).json({
      message: 'Report created successfully',
    });
}

export const  update = async (req:Request, res:Response)=> {
    console.log('Updating report');
    console.log(req.body);
    const reportId = parseInt(req.params.id);
    console.log('Report ID:', reportId);
    const response = await reportService.updateReport(reportId, req.body);
    if (!response) {
        res.status(404).json({ message: 'Report not found' });
        return;
    }
    res.status(200).json({
        message: 'Report updated successfully',
    });
}

export const  deleteReport = async (req:Request, res:Response)=> {
    console.log('Deleting report');
    const reportId = parseInt(req.params.id);
    const response = await reportService.deleteReport(reportId);
    if (!response) {
        res.status(404).json({ message: 'Report not found' });
        return;
    }
    res.status(200).json({
        message: 'Report deleted successfully',
        report: response
    });
}
export const  getAll = async (req:Request, res:Response)=> {
    console.log('Getting all reports');
    const response = await reportService.findAll();
    if (!response) {
        res.status(404).json({ message: 'No reports found' });
        return;
    }
    res.status(200).json(response);
}
export const  getByProject = async (req:Request, res:Response)=> {
    console.log('Getting reports by project');
    const projectId = parseInt(req.params.projectId);
    console.log('Project ID:', projectId);
    const response = await reportService.findByProject(projectId);
    if (!response) {
        res.status(404).json({ message: 'No reports found for this project' });
        return;
    }
    res.status(200).json(response);
}

export const  getById = async (req:Request, res:Response)=> {
    console.log('Getting report by ID');
    const reportId = parseInt(req.params.id);
    const response = await reportService.findById(reportId);
    if (!response) {
        res.status(404).json({ message: 'Report not found' });
        return;
    }
    res.status(200).json(response);
}
