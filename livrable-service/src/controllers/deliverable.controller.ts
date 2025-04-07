import e, { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Deliverable } from '../entities/Deliverable';
import { ValidationRule } from '../entities/ValidationRule';
import { Submission } from '../entities/Submission';
import {DeliverableService} from '../services/deliverable.service';

const  deliverableService = new DeliverableService();
// Create a new deliverable
export const createDeliverable = async (req: Request, res: Response) => {
  try {
    const deliverable = await deliverableService.createDeliverable(req.body);
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

/** Ajoute , modification, suppression et mise à jours d'une règle de valisation d'un livrable */

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
}