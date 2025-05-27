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
exports.detectSimilarityForDeliverable = detectSimilarityForDeliverable;
const database_1 = require("../config/database");
const Deliverable_1 = require("../entities/Deliverable");
const extractZip_1 = require("../utils/extractZip");
const convertToText_1 = require("../utils/convertToText");
const compareText_1 = require("../utils/compareText");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const SimilarityComparison_1 = require("../entities/SimilarityComparison");
const TEMP_DIR = path_1.default.join(__dirname, '../../tmp');
function detectSimilarityForDeliverable(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const deliverableRepo = database_1.AppDataSource.getRepository(Deliverable_1.Deliverable);
        const comparisonRepo = database_1.AppDataSource.getRepository(SimilarityComparison_1.SimilarityComparison);
        const deliverables = yield deliverableRepo.find({ where: { projectId } });
        const textMap = new Map();
        for (const deliverable of deliverables) {
            console.log(`🔍 Processing deliverable #${deliverable}`);
            if (!deliverable.fileUrl)
                continue;
            const localFolder = path_1.default.join(TEMP_DIR, `deliverable_${deliverable.id}`);
            console.log(`📥 Downloading and extracting deliverable #${deliverable.id}...`);
            yield promises_1.default.mkdir(localFolder, { recursive: true });
            yield (0, extractZip_1.extractZip)(deliverable.fileUrl, localFolder);
            const text = yield (0, convertToText_1.convertAllToText)(localFolder);
            textMap.set(deliverable.id, text);
        }
        for (let i = 0; i < deliverables.length; i++) {
            for (let j = i + 1; j < deliverables.length; j++) {
                const a = deliverables[i];
                const b = deliverables[j];
                const textA = textMap.get(a.id) || '';
                const textB = textMap.get(b.id) || '';
                const score = (0, compareText_1.compareTextSimilarity)(textA, textB);
                a.similarityRate = Math.max(a.similarityRate || 0, score);
                b.similarityRate = Math.max(b.similarityRate || 0, score);
                yield comparisonRepo.save({
                    deliverableId: a.id,
                    submissionAId: a.id,
                    submissionBId: b.id,
                    score,
                });
                console.log(`↔️ Similarity between #${a.id} and #${b.id}: ${(score * 100).toFixed(2)}%`);
                a.similarityRate = Math.max(a.similarityRate || 0, score);
                b.similarityRate = Math.max(b.similarityRate || 0, score);
            }
        }
        yield deliverableRepo.save(deliverables);
        console.log('✅ Similarity detection complete');
    });
}
