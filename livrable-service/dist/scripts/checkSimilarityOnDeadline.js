"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.checkSimilarityOnDeadline = checkSimilarityOnDeadline;
const database_1 = require("../config/database");
const Deliverable_1 = require("../entities/Deliverable");
const Submission_1 = require("../entities/Submission");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const string_similarity_1 = __importDefault(require("string-similarity"));
const TEMP_DIR = path.join(__dirname, '../../tmp');
if (!fs.existsSync(TEMP_DIR))
    fs.mkdirSync(TEMP_DIR, { recursive: true });
// Function to extract a zip file
// using AdmZip
// https://www.npmjs.com/package/adm-zip
function extractZip(zipPath, extractTo) {
    const zip = new adm_zip_1.default(zipPath);
    zip.extractAllTo(extractTo, true);
}
// function getAllTextFiles(dir: string): string[] {
//     const entries = fs.readdirSync(dir, { withFileTypes: true });
//     return entries.flatMap(entry => {
//       const fullPath = path.join(dir, entry.name);
//       if (entry.isDirectory()) {
//         if (['node_modules', 'dist', '.git','.next', 'build'].includes(entry.name)) return [];
//         return getAllTextFiles(fullPath);
//       }
//       return fullPath;
//     }).filter(f =>
//       ['.txt', '.ts', '.js', '.md', '.json', '.py', '.cs', '.java'].some(ext => f.endsWith(ext))
//     );
//   }
function getAllTextFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.flatMap(entry => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // 🔒 Dossiers à ignorer
            if (['node_modules', 'dist', '.git', '.next', 'build'].includes(entry.name))
                return [];
            return getAllTextFiles(fullPath); // 🔁 Récursion ici
        }
        // 📄 Fichiers à prendre en compte selon extension
        const allowedExtensions = ['.txt', '.ts', '.js', '.md', '.json', '.py', '.cs', '.java'];
        if (allowedExtensions.some(ext => entry.name.endsWith(ext))) {
            return [fullPath];
        }
        return [];
    });
}
function compareDirs(dirA, dirB) {
    const filesA = getAllTextFiles(dirA);
    const filesB = getAllTextFiles(dirB);
    let score = 0;
    let count = 0;
    console.log(`📄 Comparing ${filesA.length}x${filesB.length} files`);
    for (const fileA of filesA) {
        const contentA = fs.readFileSync(fileA, 'utf-8');
        for (const fileB of filesB) {
            const contentB = fs.readFileSync(fileB, 'utf-8');
            score += string_similarity_1.default.compareTwoStrings(contentA, contentB);
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
function checkSimilarityOnDeadline() {
    return __awaiter(this, void 0, void 0, function* () {
        const deliverableRepo = database_1.AppDataSource.getRepository(Deliverable_1.Deliverable);
        const submissionRepo = database_1.AppDataSource.getRepository(Submission_1.Submission);
        const now = new Date();
        const deliverables = yield deliverableRepo.find({ where: {} });
        console.log('Deliverables:', deliverables.map(d => ({ id: d.id, deadline: d.deadline })));
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        for (const d of deliverables) {
            const deadline = new Date(d.deadline);
            console.log(`🕒 Checking deliverable #${d.id} with deadline ${deadline}`);
            //if (deadline.getTime() === todayMidnight.getTime()) {
            if (now >= deadline) {
                const submissions = yield submissionRepo.find({ where: { deliverable: { id: d.id } } });
                const zipSubs = submissions.filter(s => s.fileUrl && s.fileUrl.endsWith('.zip'));
                const folders = [];
                for (const s of zipSubs) {
                    const folderPath = path.join(TEMP_DIR, `submission_${s.id}`);
                    extractZip(s.fileUrl, folderPath);
                    console.log(`📁 Extracted zip for submission ${s.id} → ${folderPath}`);
                    folders.push({ id: s.id, path: folderPath });
                }
                console.log(`📂 ${folders.length} dossiers à comparer`);
                folders.forEach(f => {
                    console.log(`🧪 ${f.id} → ${f.path}`);
                });
                for (let i = 0; i < folders.length; i++) {
                    for (let j = i + 1; j < folders.length; j++) {
                        const sim = compareDirs(folders[i].path, folders[j].path);
                        console.log(`↔️ Similarity between submission ${folders[i].id} and ${folders[j].id}: ${(sim * 100).toFixed(2)}%`);
                        //   if (sim >= 0.8) {
                        //     console.log(`↔️ Similarity between submission ${folders[i].id} and ${folders[j].id}: ${(sim * 100).toFixed(2)}%`);
                        //     const a = await submissionRepo.findOneBy({ id: folders[i].id });
                        //     const b = await submissionRepo.findOneBy({ id: folders[j].id });
                        //     if (a && b) {
                        //       a.similarityRate = Math.max(a.similarityRate || 0, sim);
                        //       b.similarityRate = Math.max(b.similarityRate || 0, sim);
                        //       await submissionRepo.save([a, b]);
                        //       console.log(`⚠️ Similarity detected between #${a.id} and #${b.id} → ${(sim * 100).toFixed(1)}%`);
                        //     }
                        //   }
                        const a = yield submissionRepo.findOneBy({ id: folders[i].id });
                        const b = yield submissionRepo.findOneBy({ id: folders[j].id });
                        if (a && b) {
                            a.similarityRate = Math.max(a.similarityRate || 0, sim);
                            b.similarityRate = Math.max(b.similarityRate || 0, sim);
                            yield submissionRepo.save([a, b]);
                            if (sim >= 0.8) {
                                console.log(`⚠️ High similarity between #${a.id} and #${b.id} → ${(sim * 100).toFixed(1)}%`);
                            }
                            else {
                                console.log(`ℹ️ Similarity between #${a.id} and #${b.id} = ${(sim * 100).toFixed(1)}%`);
                            }
                        }
                    }
                }
            }
        }
        console.log('✅ Similarity check finished');
        //process.exit(0);
    });
}
