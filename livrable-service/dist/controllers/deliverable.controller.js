"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.similarityMatrix = exports.similarityCheck = exports.downloadDeliverable = exports.getDeliverablesByGroupId = exports.getDeliverablesByProjectId = exports.getDeliverableById = exports.getAllDeliverables = exports.submitDeliverable = void 0;
const database_1 = require("../config/database");
const Deliverable_1 = require("../entities/Deliverable");
const deliverable_service_1 = require("../services/deliverable.service");
const GoogleDriveService_1 = require("../services/GoogleDriveService");
const detectSimilarity_1 = require("../scripts/detectSimilarity");
const SimilarityComparison_1 = require("../entities/SimilarityComparison");
const deliverableService = new deliverable_service_1.DeliverableService();
const googleDriveService = new GoogleDriveService_1.GoogleDriveService();
// Create a new deliverable
const submitDeliverable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, groupId, name, description, githubUrl } = req.body;
        const file = req.file;
        console.log("dans submitDeliverable");
        if (!file) {
            res.status(400).json({ message: 'File is required' });
            return;
        }
        let fileUrl = undefined;
        if (file) {
            fileUrl = yield googleDriveService.uploadFile(file);
        }
        const data = {
            projectId,
            groupId,
            name,
            description,
            githubUrl: githubUrl || null,
            fileUrl,
        };
        const deliverable = yield deliverableService.submitDeliverable(data);
        res.status(201).json({ message: 'Deliverable created successfully', deliverable });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.submitDeliverable = submitDeliverable;
// Get all deliverables for a specific project
const getAllDeliverables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliverables = yield deliverableService.getAllDeliverables();
        res.json(deliverables);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.getAllDeliverables = getAllDeliverables;
// Get a specific deliverable by ID
const getDeliverableById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliverableId = parseInt(req.params.id);
        const deliverable = yield deliverableService.getDeliverableById(deliverableId);
        if (!deliverable) {
            res.status(404).json({ message: 'Deliverable not found' });
            return;
        }
        res.status(200).json(deliverable);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.getDeliverableById = getDeliverableById;
// Get all deliverables for a specific project
const getDeliverablesByProjectId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = parseInt(req.params.id);
        const deliverables = yield deliverableService.getDeliverablesByProjectId(projectId);
        if (!deliverables) {
            res.status(404).json({ message: 'Deliverables not found for this project' });
            return;
        }
        res.status(200).json(deliverables);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.getDeliverablesByProjectId = getDeliverablesByProjectId;
// Get all deliverables for a specific group
const getDeliverablesByGroupId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = parseInt(req.params.groupId);
        console.log("dans getDeliverablesByGroupId");
        console.log("Group ID:", groupId);
        const deliverables = yield deliverableService.getDeliverablesByGroupId(groupId);
        if (!deliverables) {
            res.status(404).json({ message: 'Deliverables not found for this group' });
            return;
        }
        res.status(200).json(deliverables);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.getDeliverablesByGroupId = getDeliverablesByGroupId;
const downloadDeliverable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("dans downloadDeliverable");
    const repo = database_1.AppDataSource.getRepository(Deliverable_1.Deliverable);
    const deliverable = yield repo.findOneBy({ id: Number(id) });
    if (!deliverable || !deliverable.fileUrl) {
        res.status(404).json({ error: 'Fichier non trouvé' });
        return;
    }
    const match = deliverable.fileUrl.match(/\/d\/([^/]+)\//);
    const fileId = match === null || match === void 0 ? void 0 : match[1];
    if (!fileId) {
        res.status(400).json({ error: 'ID de fichier invalide' });
        return;
    }
    console.log(`Téléchargement du fichier avec ID: ${fileId}`);
    const driveService = new GoogleDriveService_1.GoogleDriveService();
    try {
        const fileStream = yield driveService.downloadFile(fileId);
        const fileName = yield driveService.getFileMetadata(fileId);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        fileStream.pipe(res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors du téléchargement du fichier' });
        return;
    }
});
exports.downloadDeliverable = downloadDeliverable;
const similarityCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    console.log("dans similarityCheck");
    if (!projectId || isNaN(Number(projectId))) {
        res.status(400).json({ error: 'Project ID invalide' });
        return;
    }
    try {
        yield (0, detectSimilarity_1.detectSimilarityForDeliverable)(parseInt(projectId));
        res.json({ message: `Analyse de similarité terminée pour le projet #${projectId}` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l’analyse de similarité' });
        return;
    }
});
exports.similarityCheck = similarityCheck;
const similarityMatrix = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    console.log("dans similarityMatrix");
    const comparisonRepo = database_1.AppDataSource.getRepository(SimilarityComparison_1.SimilarityComparison);
    const results = yield comparisonRepo
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
});
exports.similarityMatrix = similarityMatrix;
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
