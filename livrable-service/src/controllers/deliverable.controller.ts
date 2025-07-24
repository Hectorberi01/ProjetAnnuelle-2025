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
      const { projectId, groupId, name, description, githubUrl,fileUrl } = req.body;
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

// Get all deliverables for a specific project
export const getDeliverablesByProjectId = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    const deliverables = await deliverableService.getDeliverablesByProjectId(projectId);
    if (!deliverables) {
      res.status(404).json({ message: 'Deliverables not found for this project' });
      return;
    }
    res.status(200).json(deliverables);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all deliverables for a specific group
export const getDeliverablesByGroupId = async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.params.groupId);
    console.log("dans getDeliverablesByGroupId");
    console.log("Group ID:", groupId);
    const deliverables = await deliverableService.getDeliverablesByGroupId(groupId);
    if (!deliverables) {
      res.status(404).json({ message: 'Deliverables not found for this group' });
      return;
    }
    res.status(200).json(deliverables);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const SimilarityCheck = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const response = await deliverableService.similarityCheck(data);
    res.status(200).json({ message: 'Similarity check completed successfully', response });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// export const downloadDeliverable = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const repo = AppDataSource.getRepository(Deliverable);

//   const deliverable = await repo.findOneBy({ id: Number(id) });
//   if (!deliverable || !deliverable.fileUrl) {
//     res.status(404).json({ error: 'Fichier non trouvé' });
//     return;
//   }

//   const match = deliverable.fileUrl.match(/\/d\/([^/]+)\//);
//   const fileId = match?.[1];
//   if (!fileId) {
//     res.status(400).json({ error: 'ID de fichier invalide' });
//     return;
//   }

//   console.log(`Téléchargement du fichier avec ID: ${fileId}`);

//   const driveService = new GoogleDriveService();
//   try {
//     const fileStream = await driveService.downloadFile(fileId);
//     const fileName = await driveService.getFileMetadata(fileId);

//     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//     fileStream.pipe(res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Erreur lors du téléchargement du fichier' });
//     return;
//   }
// }

// export const similarityCheck = async (req: Request, res: Response) => {
//   const { projectId } = req.params;
//   console.log("dans similarityCheck");
//   if (!projectId || isNaN(Number(projectId))) {
//     res.status(400).json({ error: 'Project ID invalide' });
//     return;
//   }

//   try {
//     await detectSimilarityForDeliverable(parseInt(projectId));
//     res.json({ message: `Analyse de similarité terminée pour le projet #${projectId}` });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Erreur lors de l’analyse de similarité' });
//     return;
//   }
// };

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