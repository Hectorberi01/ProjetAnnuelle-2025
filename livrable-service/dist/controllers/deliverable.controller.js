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
        const { projectId, groupId, name, description, githubUrl, fileUrl } = req.body;
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
