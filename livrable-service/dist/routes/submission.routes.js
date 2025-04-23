"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const submission_controller_1 = require("../controllers/submission.controller");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const deliverableId = req.params.deliverableId;
        if (!deliverableId)
            return cb(new Error('Missing deliverableId in form data'), '');
        const folder = path_1.default.join('uploads', `projet_${deliverableId}`);
        if (!fs_1.default.existsSync(folder)) {
            fs_1.default.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
router.post('/upload/:deliverableId', upload.single('file'), submission_controller_1.uploadSubmission);
router.get('/list/:deliverableId', submission_controller_1.listSubmissions);
router.get('/download/:submissionId', submission_controller_1.downloadSubmission);
exports.default = router;
