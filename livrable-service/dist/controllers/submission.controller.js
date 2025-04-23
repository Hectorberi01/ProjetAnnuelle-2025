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
exports.downloadSubmission = exports.listSubmissions = exports.uploadSubmission = void 0;
const submission_service_1 = require("../services/submission.service");
const inspector_1 = require("inspector");
const submissionService = new submission_service_1.SubmissionService();
const uploadSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        inspector_1.console.log("dans uploadSubmission");
        inspector_1.console.log('Received file:', req.file);
        inspector_1.console.log('Received body:', req.body);
        const result = yield submissionService.handleUpload(req);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.uploadSubmission = uploadSubmission;
const listSubmissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield submissionService.listSubmissionsByDeliverable(+req.params.deliverableId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.listSubmissions = listSubmissions;
const downloadSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield submissionService.downloadSubmissionFile(+req.params.submissionId);
        if (!result) {
            res.status(404).json({ message: 'File not found' });
        }
        else {
            res.download(result);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.downloadSubmission = downloadSubmission;
