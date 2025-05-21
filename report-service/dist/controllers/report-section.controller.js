"use strict";
// import e, { Request, Response } from 'express';
// import { ReportSectionService } from "../services/report-section.service";
// import { AppDataSource } from '../config/database';
// const reportRepo = AppDataSource.getRepository('Report');
// const sectionService = new ReportSectionService();
// export const createSection = async (req:Request, res:Response)=> {
//     console.log('createSection');
//     console.log(req.body);
//     const { reportId, title, content, order } = req.body;
//     const report = await reportRepo.findOneBy({ id: reportId });
//     if (!report) {
//         res.status(404).json({ message: 'Report not found' });
//         return;
//     }
//     const response = await sectionService.createSection(report.id, title, content, order);
//     if (!response) {
//         res.status(404).json({ message: 'Section not created' });
//         return;
//     }
//     res.status(201).json({
//         message: 'Section created successfully',
//         section: response
//     });
// }
// export const updateSection = async (req:Request, res:Response)=> {
//     const { id, content } = req.body;
//     const response = await sectionService.updateSection(id, content);
//     if (!response) {
//         res.status(404).json({ message: 'Section not updated' });
//         return;
//     }
//     res.status(200).json({
//         message: 'Section updated successfully',
//         section: response
//     });
// }
// export const getSections = async (req:Request, res:Response)=> {
//     const reportId = parseInt(req.params.id);
//     const response = await sectionService.getSection(reportId);
//     if (!response) {
//         res.status(404).json({ message: 'Sections not found' });
//         return;
//     }
//     res.status(200).json(response);
// }
