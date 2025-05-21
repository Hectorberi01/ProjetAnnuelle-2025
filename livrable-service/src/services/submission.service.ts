import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { AppDataSource } from '../config/database';
import { Submission } from '../entities/Submission';
import { Deliverable } from '../entities/Deliverable';

export class SubmissionService {
  private submissionRepo = AppDataSource.getRepository(Submission);
  private deliverableRepo = AppDataSource.getRepository(Deliverable);

  public async handleUpload(req: Request) {
    const { groupId, githubUrl, submittedAt } = req.body;
    const deliverableId = parseInt(req.params.deliverableId);
    const file = req.file;

    const deliverable = await this.deliverableRepo.findOneBy({ id: deliverableId });
    if (!deliverable) throw new Error('Deliverable not found');

    const isLate = new Date(submittedAt || new Date()) > new Date(deliverable.deadline);

    const submission = this.submissionRepo.create({
        groupId,
        fileUrl: file?.path,
        githubUrl: githubUrl || null,
        submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
        isLate,
        deliverable
    });
    return await this.submissionRepo.save(submission);
  }

  public async listSubmissionsByDeliverable(deliverableId: number) {
    return await this.submissionRepo.find({
      where: { deliverable: { id: deliverableId } },
    });
  }

  public async downloadSubmissionFile(submissionId: number): Promise<string | null> {
    const submission = await this.submissionRepo.findOneBy({ id: submissionId });
    if (!submission || !submission.fileUrl) return null;
    const fullPath = path.resolve(submission.fileUrl);
    return fs.existsSync(fullPath) ? fullPath : null;
  }
}