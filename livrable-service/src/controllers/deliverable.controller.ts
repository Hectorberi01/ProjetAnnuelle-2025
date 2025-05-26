import e, { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Deliverable } from '../entities/Deliverable';
import {DeliverableService} from '../services/deliverable.service';
import { GoogleDriveService } from '../services/GoogleDriveService';
import { detectSimilarityForDeliverable } from '../scripts/detectSimilarity';
import { SimilarityComparison } from '../entities/SimilarityComparison';

const  deliverableService = new DeliverableService();
const googleDriveService = new GoogleDriveService();
// Create a new deliverable
export const submitDeliverable = async (req: Request, res: Response) => {
  try {
      const { projectId, groupId, name, description, githubUrl } = req.body;
      const file = req.file;

      console.log("dans submitDeliverable");

      if (!file) {
        res.status(400).json({ message: 'File is required' });
        return;
      }

      let fileUrl: string | undefined = undefined;

      if (file) {
        fileUrl = await googleDriveService.uploadFile(file);
      }

      const data = {
        projectId,
        groupId,
        name,
        description,
        githubUrl: githubUrl || null,
        fileUrl,
      };

      const deliverable = await deliverableService.submitDeliverable(data);

      res.status(201).json({ message: 'Deliverable created successfully', deliverable });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all deliverables for a specific project
export const getAllDeliverables = async (req: Request, res: Response) => {
  try {
    const deliverables = await deliverableService.getAllDeliverables();
    res.json(deliverables);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};


// Get a specific deliverable by ID
export const getDeliverableById = async (req: Request, res: Response) => {
  try {
    const deliverableId = parseInt(req.params.id);
    const deliverable = await deliverableService.getDeliverableById(deliverableId);
    if (!deliverable) {
      res.status(404).json({ message: 'Deliverable not found' });
      return;
    }
    res.status(200).json(deliverable);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const downloadDeliverable = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("dans downloadDeliverable");
  const repo = AppDataSource.getRepository(Deliverable);

  const deliverable = await repo.findOneBy({ id: Number(id) });
  if (!deliverable || !deliverable.fileUrl) {
    res.status(404).json({ error: 'Fichier non trouvé' });
    return;
  }

  const match = deliverable.fileUrl.match(/\/d\/([^/]+)\//);
  const fileId = match?.[1];
  if (!fileId) {
    res.status(400).json({ error: 'ID de fichier invalide' });
    return;
  }

  console.log(`Téléchargement du fichier avec ID: ${fileId}`);

  const driveService = new GoogleDriveService();
  try {
    const fileStream = await driveService.downloadFile(fileId);
    const fileName = await driveService.getFileMetadata(fileId);

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    fileStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du téléchargement du fichier' });
    return;
  }
}

export const similarityCheck = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  console.log("dans similarityCheck");
  if (!projectId || isNaN(Number(projectId))) {
    res.status(400).json({ error: 'Project ID invalide' });
    return;
  }

  try {
    await detectSimilarityForDeliverable(parseInt(projectId));
    res.json({ message: `Analyse de similarité terminée pour le projet #${projectId}` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l’analyse de similarité' });
    return;
  }
};

export const similarityMatrix = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  console.log("dans similarityMatrix");
  
  const comparisonRepo = AppDataSource.getRepository(SimilarityComparison);
  const results = await comparisonRepo
    .createQueryBuilder('sc')
    .innerJoin('deliverable', 'd', 'sc.deliverableId = d.id')
    .where('d.projectId = :projectId', { projectId })
    .getMany();

  const matrix = results.map(r => ({
    deliverableA: r.submissionAId,
    deliverableB: r.submissionBId,
    score: (r.score * 100).toFixed(2) + '%',
    isSuspected: r.score >= 0.8,
  }));

  res.json({ projectId, comparisons: matrix });
}

/*
// Get all deliverables
export const getDeliverablesByProjectId = async (req: Request, res: Response) => {
  try {
    const deliverables = await deliverableService.getProjectDeliverables(parseInt(req.params.id));
    if (!deliverables) {
      res.status(404).json({ message: 'Deliverables not found for this project' });
    }
    res.json(deliverables);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get a specific deliverable by ID
export const getDeliverableById = async (req: Request, res: Response) => {
  try {
    const deliverableId = parseInt(req.params.id);
    const Response = await deliverableService.getDeliverableById(deliverableId);
    if (!Response) {
      res.status(404).json({ message: 'Deliverable not found' });
      return;
    }
    res.status(200).send(Response);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Update a deliverable
export const updateDeliverable = async (req: Request, res: Response) => {
  try {
    const deliverable = await deliverableService.updateDeliverable(parseInt(req.params.id), req.body);
    if (!deliverable) {
      res.status(404).json({ message: 'Deliverable not found' });
      return;
    }

    res.status(200).json({ message: 'Deliverable updated successfully', deliverable });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Delete a deliverable
export const deleteDeliverable = async (req: Request, res: Response) => {
  try {
    const response = await deliverableService.deleteDeliverable(parseInt(req.params.id));
    if (!response) {
      res.status(404).json({ message: 'Deliverable not found' });
      return;
    }
    res.status(200).json({ message: 'Deliverable deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Get all validation rules for a specific deliverable
export const getValidationRulesForDeliverable = async (req: Request, res: Response) => {
  try {
    const deliverablesRules  = await deliverableService.getDeliverablesById(parseInt(req.params.id));
    if (!deliverablesRules) {
      res.status(404).json({ message: 'Deliverable not found' });
      return;
    }

    res.status(200).send(deliverablesRules);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}


// Add a validation rule to a specific deliverable
export const addValidationRule = async (req: Request, res: Response) => {
  try {
    const { type, value } = req.body;
    const data = { type, value };
    const response = await deliverableService.createValidationRule(data, parseInt(req.params.id));
    if (!response) {
      res.status(404).json({ message: 'Deliverable not found' });
      return;
    }

    res.status(201).json({ message: 'Validation rule added successfully', response });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Update a validation rule for a specific deliverable
export const updateValidationRule = async (req: Request, res: Response) => {
  try {
    const { type, value } = req.body;

    const response = await deliverableService.updateValidationRule(parseInt(req.params.ruleId), { type, value });
    if (!response) {
      res.status(404).json({ message: 'Validation rule not found' });
    }
   
    res.json({ message: 'Validation rule updated successfully', response });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Delete a validation rule for a specific deliverable
export const deleteValidationRule = async (req: Request, res: Response) => {
  try {
    const ruleId = parseInt(req.params.ruleId);
    const response = await deliverableService.deleteValidationRule(ruleId);
    if (!response) {
      res.status(404).json({ message: 'Validation rule not found' });
      return;
    }
    res.json({ message: 'Validation rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}


// Get all submissions for a specific deliverable
export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const deliverableId = parseInt(req.params.id);
    const deliverableRepo = AppDataSource.getRepository(Deliverable);
    const deliverable = await deliverableRepo.findOne({
      where: { id: deliverableId },
      relations: ['submissions'],
    });

    if (!deliverable) {
      return res.status(404).json({ message: 'Deliverable not found' });
    }

    res.json(deliverable.submissions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}
// Add a submission for a specific deliverable
export const addSubmission = async (req: Request, res: Response) => {
  try {
    const deliverableId = parseInt(req.params.id);
    const { groupId, fileUrl, submittedAt, isLate, similarityRate } = req.body;

    const deliverableRepo = AppDataSource.getRepository(Deliverable);
    const submissionRepo = AppDataSource.getRepository(Submission);

    const deliverable = await deliverableRepo.findOne({ where: { id: deliverableId } });

    if (!deliverable) {
      return res.status(404).json({ message: 'Deliverable not found' });
    }

    const submission = submissionRepo.create({ groupId, fileUrl, submittedAt, isLate, similarityRate, deliverable });
    await submissionRepo.save(submission);

    res.status(201).json({ message: 'Submission added successfully', submission });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}
// Update a submission for a specific deliverable
export const updateSubmission = async (req: Request, res: Response) => {
  try {
    const submissionId = parseInt(req.params.submissionId);
    const { groupId, fileUrl, submittedAt, isLate, similarityRate } = req.body;

    const submissionRepo = AppDataSource.getRepository(Submission);
    const submission = await submissionRepo.findOne({ where: { id: submissionId } });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Update the submission properties
    submission.groupId = groupId;
    submission.fileUrl = fileUrl;
    submission.submittedAt = submittedAt;
    submission.isLate = isLate;
    submission.similarityRate = similarityRate;

    await submissionRepo.save(submission);

    res.json({ message: 'Submission updated successfully', submission });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}
// Delete a submission for a specific deliverable
export const deleteSubmission = async (req: Request, res: Response) => {
  try {
    const submissionId = parseInt(req.params.submissionId);
    const submissionRepo = AppDataSource.getRepository(Submission);
    const submission = await submissionRepo.findOne({ where: { id: submissionId } });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    await submissionRepo.remove(submission);

    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}
// Get a specific submission by ID
export const getSubmissionById = async (req: Request, res: Response) => {
  try {
    const submissionId = parseInt(req.params.submissionId);
    const submissionRepo = AppDataSource.getRepository(Submission);
    const submission = await submissionRepo.findOne({
      where: { id: submissionId },
      relations: ['deliverable'],
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}
// Get all submissions for a specific group and deliverable
export const getGroupSubmissions = async (req: Request, res: Response) => {
  try {
    const { groupId, deliverableId } = req.params;
    const submissionRepo = AppDataSource.getRepository(Submission);
    const submissions = await submissionRepo.find({
      where: { groupId: parseInt(groupId), id: parseInt(deliverableId) },
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
*/