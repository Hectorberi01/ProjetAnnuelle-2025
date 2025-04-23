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
exports.getGroupSubmissions = exports.getSubmissionById = exports.deleteSubmission = exports.updateSubmission = exports.addSubmission = exports.getSubmissions = exports.deleteValidationRule = exports.updateValidationRule = exports.addValidationRule = exports.getValidationRulesForDeliverable = exports.deleteDeliverable = exports.updateDeliverable = exports.getDeliverableById = exports.getDeliverablesByProjectId = exports.getAllDeliverables = exports.createDeliverable = void 0;
const database_1 = require("../config/database");
const Deliverable_1 = require("../entities/Deliverable");
const Submission_1 = require("../entities/Submission");
const deliverable_service_1 = require("../services/deliverable.service");
const deliverableService = new deliverable_service_1.DeliverableService();
// Create a new deliverable
const createDeliverable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliverable = yield deliverableService.createDeliverable(req.body);
        res.status(201).json({ message: 'Deliverable created successfully', deliverable });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.createDeliverable = createDeliverable;
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
// Get all deliverables
const getDeliverablesByProjectId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliverables = yield deliverableService.getProjectDeliverables(parseInt(req.params.id));
        if (!deliverables) {
            res.status(404).json({ message: 'Deliverables not found for this project' });
        }
        res.json(deliverables);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.getDeliverablesByProjectId = getDeliverablesByProjectId;
// Get a specific deliverable by ID
const getDeliverableById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliverableId = parseInt(req.params.id);
        const Response = yield deliverableService.getDeliverableById(deliverableId);
        if (!Response) {
            res.status(404).json({ message: 'Deliverable not found' });
            return;
        }
        res.status(200).send(Response);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.getDeliverableById = getDeliverableById;
// Update a deliverable
const updateDeliverable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliverable = yield deliverableService.updateDeliverable(parseInt(req.params.id), req.body);
        if (!deliverable) {
            res.status(404).json({ message: 'Deliverable not found' });
            return;
        }
        res.status(200).json({ message: 'Deliverable updated successfully', deliverable });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.updateDeliverable = updateDeliverable;
// Delete a deliverable
const deleteDeliverable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield deliverableService.deleteDeliverable(parseInt(req.params.id));
        if (!response) {
            res.status(404).json({ message: 'Deliverable not found' });
            return;
        }
        res.status(200).json({ message: 'Deliverable deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.deleteDeliverable = deleteDeliverable;
// Get all validation rules for a specific deliverable
const getValidationRulesForDeliverable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliverablesRules = yield deliverableService.getDeliverablesById(parseInt(req.params.id));
        if (!deliverablesRules) {
            res.status(404).json({ message: 'Deliverable not found' });
            return;
        }
        res.status(200).send(deliverablesRules);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.getValidationRulesForDeliverable = getValidationRulesForDeliverable;
/** Ajoute , modification, suppression et mise à jours d'une règle de valisation d'un livrable */
// Add a validation rule to a specific deliverable
const addValidationRule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, value } = req.body;
        const data = { type, value };
        const response = yield deliverableService.createValidationRule(data, parseInt(req.params.id));
        if (!response) {
            res.status(404).json({ message: 'Deliverable not found' });
            return;
        }
        res.status(201).json({ message: 'Validation rule added successfully', response });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.addValidationRule = addValidationRule;
// Update a validation rule for a specific deliverable
const updateValidationRule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, value } = req.body;
        const response = yield deliverableService.updateValidationRule(parseInt(req.params.ruleId), { type, value });
        if (!response) {
            res.status(404).json({ message: 'Validation rule not found' });
        }
        res.json({ message: 'Validation rule updated successfully', response });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.updateValidationRule = updateValidationRule;
// Delete a validation rule for a specific deliverable
const deleteValidationRule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ruleId = parseInt(req.params.ruleId);
        const response = yield deliverableService.deleteValidationRule(ruleId);
        if (!response) {
            res.status(404).json({ message: 'Validation rule not found' });
            return;
        }
        res.json({ message: 'Validation rule deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.deleteValidationRule = deleteValidationRule;
// Get all submissions for a specific deliverable
const getSubmissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliverableId = parseInt(req.params.id);
        const deliverableRepo = database_1.AppDataSource.getRepository(Deliverable_1.Deliverable);
        const deliverable = yield deliverableRepo.findOne({
            where: { id: deliverableId },
            relations: ['submissions'],
        });
        if (!deliverable) {
            return res.status(404).json({ message: 'Deliverable not found' });
        }
        res.json(deliverable.submissions);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.getSubmissions = getSubmissions;
// Add a submission for a specific deliverable
const addSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliverableId = parseInt(req.params.id);
        const { groupId, fileUrl, submittedAt, isLate, similarityRate } = req.body;
        const deliverableRepo = database_1.AppDataSource.getRepository(Deliverable_1.Deliverable);
        const submissionRepo = database_1.AppDataSource.getRepository(Submission_1.Submission);
        const deliverable = yield deliverableRepo.findOne({ where: { id: deliverableId } });
        if (!deliverable) {
            return res.status(404).json({ message: 'Deliverable not found' });
        }
        const submission = submissionRepo.create({ groupId, fileUrl, submittedAt, isLate, similarityRate, deliverable });
        yield submissionRepo.save(submission);
        res.status(201).json({ message: 'Submission added successfully', submission });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.addSubmission = addSubmission;
// Update a submission for a specific deliverable
const updateSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissionId = parseInt(req.params.submissionId);
        const { groupId, fileUrl, submittedAt, isLate, similarityRate } = req.body;
        const submissionRepo = database_1.AppDataSource.getRepository(Submission_1.Submission);
        const submission = yield submissionRepo.findOne({ where: { id: submissionId } });
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        // Update the submission properties
        submission.groupId = groupId;
        submission.fileUrl = fileUrl;
        submission.submittedAt = submittedAt;
        submission.isLate = isLate;
        submission.similarityRate = similarityRate;
        yield submissionRepo.save(submission);
        res.json({ message: 'Submission updated successfully', submission });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.updateSubmission = updateSubmission;
// Delete a submission for a specific deliverable
const deleteSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissionId = parseInt(req.params.submissionId);
        const submissionRepo = database_1.AppDataSource.getRepository(Submission_1.Submission);
        const submission = yield submissionRepo.findOne({ where: { id: submissionId } });
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        yield submissionRepo.remove(submission);
        res.json({ message: 'Submission deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.deleteSubmission = deleteSubmission;
// Get a specific submission by ID
const getSubmissionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissionId = parseInt(req.params.submissionId);
        const submissionRepo = database_1.AppDataSource.getRepository(Submission_1.Submission);
        const submission = yield submissionRepo.findOne({
            where: { id: submissionId },
            relations: ['deliverable'],
        });
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.json(submission);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.getSubmissionById = getSubmissionById;
// Get all submissions for a specific group and deliverable
const getGroupSubmissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupId, deliverableId } = req.params;
        const submissionRepo = database_1.AppDataSource.getRepository(Submission_1.Submission);
        const submissions = yield submissionRepo.find({
            where: { groupId: parseInt(groupId), id: parseInt(deliverableId) },
        });
        res.json(submissions);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.getGroupSubmissions = getGroupSubmissions;
