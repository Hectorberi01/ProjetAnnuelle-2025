"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const deliverable_controller_1 = require("../controllers/deliverable.controller");
const router = (0, express_1.Router)();
// const upload = multer({
//   dest: 'uploads/'
// });
const upload = (0, multer_1.default)();
//router.post('/', upload.single('file'), submitDeliverable);
router.post('/', upload.none(), deliverable_controller_1.submitDeliverable);
//router.get('/:id/download', downloadDeliverable);
// All livrable routes
router.get('/', deliverable_controller_1.getAllDeliverables);
router.get('/:id', deliverable_controller_1.getDeliverableById);
router.get('/project/:id', deliverable_controller_1.getDeliverablesByProjectId);
router.get('/groups/:groupId', deliverable_controller_1.getDeliverablesByGroupId);
router.post('/similarity', deliverable_controller_1.SimilarityCheck);
//router.post('/internal/similarity-check/project/:projectId', similarityCheck);
router.get('/projects/:projectId/similarity-matrix', deliverable_controller_1.similarityMatrix);
exports.default = router;
