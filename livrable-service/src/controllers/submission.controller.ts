/*import { Request, Response } from 'express';
//import { SubmissionService } from '../services/submission.service';
import { console } from 'inspector';

const submissionService = new SubmissionService();

export const uploadSubmission = async (req: Request, res: Response) => {
  try {
    console.log("dans uploadSubmission");
    console.log('Received file:', req.file);
    console.log('Received body:', req.body);
    const result = await submissionService.handleUpload(req);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const listSubmissions = async (req: Request, res: Response) => {
  try {
    const result = await submissionService.listSubmissionsByDeliverable(+req.params.deliverableId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const downloadSubmission = async (req: Request, res: Response) => {
  try {
    const result = await submissionService.downloadSubmissionFile(+req.params.submissionId);
    if (!result) {
        res.status(404).json({ message: 'File not found' });
    }
    else {
        res.download(result);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};*/