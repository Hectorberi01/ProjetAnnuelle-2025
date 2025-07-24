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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliverableService = void 0;
const database_1 = require("../config/database");
const Deliverable_1 = require("../entities/Deliverable");
const SimilarityComparison_1 = require("../entities/SimilarityComparison");
const ValidationRule_1 = require("../entities/ValidationRule");
const detectSimilarity_1 = require("../scripts/detectSimilarity");
const node_cron_1 = __importDefault(require("node-cron"));
const deliverableRepo = database_1.AppDataSource.getRepository(Deliverable_1.Deliverable);
const similarityRepo = database_1.AppDataSource.getRepository(SimilarityComparison_1.SimilarityComparison);
const ruleRepo = database_1.AppDataSource.getRepository(ValidationRule_1.ValidationRule);
class DeliverableService {
    constructor() {
        // Fonction pour créer un livrable
        this.submitDeliverable = (data) => __awaiter(this, void 0, void 0, function* () {
            const { projectId, groupId, name, description, githubUrl, fileUrl } = data;
            const deliverable = deliverableRepo.create({
                projectId,
                groupId,
                name,
                description,
                githubUrl: githubUrl || null,
                fileUrl: fileUrl || null,
                submittedAt: new Date(),
            });
            const savedDeliverable = yield deliverableRepo.save(deliverable);
            if (!savedDeliverable) {
                throw new Error('Error saving deliverable');
            }
            console.log(`Deliverable #${savedDeliverable.id} created for group ${groupId} in project ${projectId}`);
            return savedDeliverable;
        });
    }
    // Récupérer tous les livrables d'un projet spécifique
    getAllDeliverables() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield deliverableRepo.find();
            }
            catch (error) {
                throw new Error('Error fetching all deliverables');
            }
        });
    }
    // Fonction pour récupérer un livrable par son ID
    getDeliverableById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield deliverableRepo.findOne({ where: { id } });
        });
    }
    // Fonction pour récupérer les livrables d'un projet spécifique
    getDeliverablesByProjectId(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield deliverableRepo.find({
                    where: { projectId },
                    order: { submittedAt: 'DESC' }, // Optionnel : trier par date de soumission
                });
            }
            catch (error) {
                throw new Error('Error fetching project deliverables');
            }
        });
    }
    // Fonction pour récupérer tous les livrables d'un groupe spécifique
    getDeliverablesByGroupId(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield deliverableRepo.find({
                    where: { groupId },
                });
            }
            catch (error) {
                throw new Error('Error fetching group deliverables');
            }
        });
    }
    // Fonction pour supprimer un livrable
    deleteDeliverable(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deliverable = yield deliverableRepo.findOne({ where: { id } });
            if (!deliverable) {
                return null;
            }
            return yield deliverableRepo.remove(deliverable);
        });
    }
    // Assuming you have a Similarity entity, use its repository instead.
    similarityCheck(data) {
        return __awaiter(this, void 0, void 0, function* () {
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
                return yield similarityRepo.save(similarity);
            }
            catch (error) {
                console.error('Error during similarity check:', error);
                throw new Error('Error during similarity check');
            }
        });
    }
    startSimilarityCron() {
        return __awaiter(this, void 0, void 0, function* () {
            node_cron_1.default.schedule('0 * * * *', () => __awaiter(this, void 0, void 0, function* () {
                console.log('🕒 Vérification de similarité planifiée');
                const repo = database_1.AppDataSource.getRepository(Deliverable_1.Deliverable);
                const deliverables = yield repo.find();
                const now = new Date();
                for (const d of deliverables) {
                    const deadline = yield this.fetchDeadlineFromProjectService(d.projectId);
                    if (deadline && new Date(deadline) < now) {
                        console.log(`📌 Analyse du livrable ${d.id}`);
                        yield (0, detectSimilarity_1.detectSimilarityForDeliverable)(d.id);
                    }
                }
            }));
        });
    }
    fetchDeadlineFromProjectService(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectUrl = process.env.PROJECT_SERVICE_URL || 'http://projets:3002/projects'; // Default URL if not set
                const response = yield fetch(`${projectUrl}/${projectId}`);
                if (!response.ok) {
                    throw new Error(`Error fetching deadline for project ${projectId}`);
                }
                const data = yield response.json();
                const deadline = data.deadline; // Assuming the API returns { deadline: "YYYY-MM-DD" }
                return deadline;
            }
            catch (error) {
                console.error('❌ Error fetching deadline:', error);
            }
            return null;
        });
    }
}
exports.DeliverableService = DeliverableService;
