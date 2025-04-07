import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { uploadSubmission, listSubmissions, downloadSubmission } from '../controllers/submission.controller';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const deliverableId = req.params.deliverableId;
    if (!deliverableId) return cb(new Error('Missing deliverableId in form data'), '');

    const folder = path.join('uploads', `projet_${deliverableId}`);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/upload/:deliverableId', upload.single('file'), uploadSubmission);
router.get('/list/:deliverableId', listSubmissions);
router.get('/download/:submissionId', downloadSubmission);

export default router;