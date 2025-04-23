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
exports.SubmissionService = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const database_1 = require("../config/database");
const Submission_1 = require("../entities/Submission");
const Deliverable_1 = require("../entities/Deliverable");
class SubmissionService {
    constructor() {
        this.submissionRepo = database_1.AppDataSource.getRepository(Submission_1.Submission);
        this.deliverableRepo = database_1.AppDataSource.getRepository(Deliverable_1.Deliverable);
    }
    handleUpload(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { groupId, githubUrl, submittedAt } = req.body;
            const deliverableId = parseInt(req.params.deliverableId);
            console.log("deliverableId", deliverableId);
            console.log("req.body", req.body);
            console.log("req.file", req.file);
            const file = req.file;
            const deliverable = yield this.deliverableRepo.findOneBy({ id: deliverableId });
            if (!deliverable)
                throw new Error('Deliverable not found');
            const isLate = new Date(submittedAt || new Date()) > new Date(deliverable.deadline);
            const submission = this.submissionRepo.create({
                groupId,
                fileUrl: file === null || file === void 0 ? void 0 : file.path,
                githubUrl: githubUrl || null,
                submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
                isLate,
                deliverable
            });
            return yield this.submissionRepo.save(submission);
        });
    }
    listSubmissionsByDeliverable(deliverableId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.submissionRepo.find({
                where: { deliverable: { id: deliverableId } },
            });
        });
    }
    downloadSubmissionFile(submissionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const submission = yield this.submissionRepo.findOneBy({ id: submissionId });
            if (!submission || !submission.fileUrl)
                return null;
            const fullPath = path_1.default.resolve(submission.fileUrl);
            return fs_1.default.existsSync(fullPath) ? fullPath : null;
        });
    }
}
exports.SubmissionService = SubmissionService;
