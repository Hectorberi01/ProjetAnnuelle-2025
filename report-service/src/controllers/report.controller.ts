import e, { Request, Response } from 'express';
import { ReportService } from '../services/report.service';

const reportService = new ReportService();

export const  create = async (req:Request, res:Response)=> {
    console.log('Creating report');
    console.log(req.body);
    const { projectId, groupId } = req.body;
    console.log('Project ID:', projectId);
    const response= await reportService.createReport(projectId, groupId);
    res.status(201).json({
        message: 'Report created successfully',
        report: response
    });
}

export const getReports =  async (req:Request, res:Response) =>{
    console.log('Getting reports');
    const projectId = parseInt(req.params.projectId);
    console.log('Project ID:', req.body);
    const response =  await reportService.findByProject(projectId);

    if (!response) {
        res.status(404).json({ message: 'No reports found for this project' });
        return;
    }
    res.status(200).json(response);
}


export const  getReportById =  async (req:Request, res:Response) =>{
    const reportId = parseInt(req.params.id);
    const response = await reportService.findOne(reportId);

    if (!response) {
        res.status(404).json({ message: 'Report not found' });
        return;
    }
    res.status(200).json(response);
}
