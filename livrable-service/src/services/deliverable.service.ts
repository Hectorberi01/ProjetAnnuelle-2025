import { AppDataSource } from '../config/database';
import { Deliverable } from '../entities/Deliverable';
import { SimilarityComparison } from '../entities/SimilarityComparison';
import { ValidationRule } from '../entities/ValidationRule';
import { detectSimilarityForDeliverable } from '../scripts/detectSimilarity';
import cron from 'node-cron';


const deliverableRepo = AppDataSource.getRepository(Deliverable);
const similarityRepo = AppDataSource.getRepository(SimilarityComparison);
const ruleRepo = AppDataSource.getRepository(ValidationRule);
interface SimilarityCheckData {
    deliverableId: number;
    submissionAId: number;
    submissionBId: number;
    score: number;
}
export class DeliverableService {
    constructor() {}

    // Fonction pour créer un livrable
    public submitDeliverable = async (data: any) => {
        const {projectId, groupId, name, description,githubUrl,fileUrl} = data;
        const deliverable = deliverableRepo.create({
            projectId,
            groupId,
            name,
            description,
            githubUrl: githubUrl || null,
            fileUrl: fileUrl || null,
            submittedAt: new Date(),
        });
        
        const savedDeliverable = await deliverableRepo.save(deliverable);
        if (!savedDeliverable) {
            throw new Error('Error saving deliverable');
        }

        console.log(`Deliverable #${savedDeliverable.id} created for group ${groupId} in project ${projectId}`);

        return savedDeliverable;
    }

    // Récupérer tous les livrables d'un projet spécifique
    public async getAllDeliverables() {
        try {
            return await deliverableRepo.find();
        } catch (error) {
            throw new Error('Error fetching all deliverables');
        }
    }

    // Fonction pour récupérer un livrable par son ID
    public async getDeliverableById(id: number) {
        return await deliverableRepo.findOne({ where: { id } });
    }

    // Fonction pour récupérer les livrables d'un projet spécifique
    public async getDeliverablesByProjectId(projectId: number) {
        try {
            return await deliverableRepo.find({
                where: { projectId },
                order: { submittedAt: 'DESC' }, // Optionnel : trier par date de soumission
            });
        } catch (error) {
            throw new Error('Error fetching project deliverables');
        }
    }

    // Fonction pour récupérer tous les livrables d'un groupe spécifique
    public async getDeliverablesByGroupId(groupId: number) {
        try {
        return await deliverableRepo.find({
            where: { groupId },
        });
        } catch (error) {
            throw new Error('Error fetching group deliverables');
        }
    }


    // Fonction pour supprimer un livrable
    public async deleteDeliverable(id: number) {
        const deliverable = await deliverableRepo.findOne({ where: { id } });
        if (!deliverable) {return null;}
        return await deliverableRepo.remove(deliverable);
    }

    // Assuming you have a Similarity entity, use its repository instead.
    public async similarityCheck(data: SimilarityCheckData) {
        try {
            // Replace 'Similarity' with your actual Similarity entity
            if (!data.deliverableId || !data.submissionAId || !data.submissionBId || !data.score) {
                throw new Error('Missing required fields for similarity check');
            }
            const similarity = similarityRepo.create({
                deliverableId: data.deliverableId,
                submissionAId: data.submissionAId,
                submissionBId: data.submissionBId,
                score: data.score,
            });
            if (!similarity) {
                throw new Error('Similarity not found');
            }
            return await similarityRepo.save(similarity);
        } catch (error) {
            console.error('Error during similarity check:', error);
            throw new Error('Error during similarity check');
        }
    }

    public async startSimilarityCron() {
        cron.schedule('0 * * * *', async () => {
            console.log('🕒 Vérification de similarité planifiée');
            const repo = AppDataSource.getRepository(Deliverable);

            const deliverables = await repo.find();

            const now = new Date();

            for (const d of deliverables) {
                const deadline = await this.fetchDeadlineFromProjectService(d.projectId);
                if (deadline && new Date(deadline) < now) {
                    console.log(`📌 Analyse du livrable ${d.id}`);
                    await detectSimilarityForDeliverable(d.id);
                }
            }
        });
    }

    public async fetchDeadlineFromProjectService(projectId: number): Promise<string | null> {
        try {
            const projectUrl = process.env.PROJECT_SERVICE_URL || 'http://projets:3002/projects'; // Default URL if not set
            const response = await fetch(`${projectUrl}/${projectId}`);
            if (!response.ok) {
                throw new Error(`Error fetching deadline for project ${projectId}`);
            }
            const data = await response.json();
            const deadline = data.deadline; // Assuming the API returns { deadline: "YYYY-MM-DD" }
            return deadline;
        } catch (error) {
            console.error('❌ Error fetching deadline:', error);
        }
        return null;
    }

}
