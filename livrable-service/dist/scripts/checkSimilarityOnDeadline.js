"use strict";
// import { AppDataSource } from '../config/database';
// import { Deliverable } from '../entities/Deliverable';
// import { Submission } from '../entities/Submission';
// import * as fs from 'fs';
// import * as path from 'path';
// import AdmZip from 'adm-zip';
// import stringSimilarity from 'string-similarity';
// const TEMP_DIR = path.join(__dirname, '../../tmp');
// if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
// // Function to extract a zip file
// // using AdmZip
// // https://www.npmjs.com/package/adm-zip
// function extractZip(zipPath: string, extractTo: string) {
//   const zip = new AdmZip(zipPath);
//   zip.extractAllTo(extractTo, true);
// }
// // function getAllTextFiles(dir: string): string[] {
// //     const entries = fs.readdirSync(dir, { withFileTypes: true });
// //     return entries.flatMap(entry => {
// //       const fullPath = path.join(dir, entry.name);
// //       if (entry.isDirectory()) {
// //         if (['node_modules', 'dist', '.git','.next', 'build'].includes(entry.name)) return [];
// //         return getAllTextFiles(fullPath);
// //       }
// //       return fullPath;
// //     }).filter(f =>
// //       ['.txt', '.ts', '.js', '.md', '.json', '.py', '.cs', '.java'].some(ext => f.endsWith(ext))
// //     );
// //   }
// function getAllTextFiles(dir: string): string[] {
//     const entries = fs.readdirSync(dir, { withFileTypes: true });
//     return entries.flatMap(entry => {
//       const fullPath = path.join(dir, entry.name);
//       if (entry.isDirectory()) {
//         // 🔒 Dossiers à ignorer
//         if (['node_modules', 'dist', '.git', '.next', 'build'].includes(entry.name)) return [];
//         return getAllTextFiles(fullPath); // 🔁 Récursion ici
//       }
//       // 📄 Fichiers à prendre en compte selon extension
//       const allowedExtensions = ['.txt', '.ts', '.js', '.md', '.json', '.py', '.cs', '.java'];
//       if (allowedExtensions.some(ext => entry.name.endsWith(ext))) {
//         return [fullPath];
//       }
//       return [];
//     });
//   }
// function compareDirs(dirA: string, dirB: string): number {
//   const filesA = getAllTextFiles(dirA);
//   const filesB = getAllTextFiles(dirB);
//   let score = 0;
//   let count = 0;
//   console.log(`📄 Comparing ${filesA.length}x${filesB.length} files`);
//   for (const fileA of filesA) {
//     const contentA = fs.readFileSync(fileA, 'utf-8');
//     for (const fileB of filesB) {
//       const contentB = fs.readFileSync(fileB, 'utf-8');
//       score += stringSimilarity.compareTwoStrings(contentA, contentB);
//       count++;
//     }
//   }
//   return count > 0 ? score / count : 0;
// }
// export async function checkSimilarityOnAllDeliverables() {
//   const deliverableRepo = AppDataSource.getRepository(Deliverable);
//   const submissionRepo = AppDataSource.getRepository(Submission);
//   try {
//     const deliverables = await deliverableRepo.find();
//     for (const d of deliverables) {
//       console.log(`📌 Checking deliverable #${d.id}`);
//       const submissions = await submissionRepo.find({
//         where: { deliverable: { id: d.id } },
//       });
//       const zipSubs = submissions.filter(s => s.fileUrl && s.fileUrl.endsWith('.zip'));
//       const folders: { id: number; path: string }[] = [];
//       for (const s of zipSubs) {
//         const folderPath = path.join(TEMP_DIR, `submission_${s.id}`);
//         await extractZip(s.fileUrl!, folderPath);
//         folders.push({ id: s.id, path: folderPath });
//         console.log(`📂 Submission ${s.id} extracted to ${folderPath}`);
//       }
//       for (let i = 0; i < folders.length; i++) {
//         for (let j = i + 1; j < folders.length; j++) {
//           const sim = compareDirs(folders[i].path, folders[j].path);
//           const simPct = (sim * 100).toFixed(2);
//           const [a, b] = await Promise.all([
//             submissionRepo.findOneBy({ id: folders[i].id }),
//             submissionRepo.findOneBy({ id: folders[j].id }),
//           ]);
//           if (a && b) {
//             a.similarityRate = Math.max(a.similarityRate || 0, sim);
//             b.similarityRate = Math.max(b.similarityRate || 0, sim);
//             await submissionRepo.save([a, b]);
//             if (sim >= 0.8) {
//               console.warn(`⚠️ HIGH similarity between #${a.id} and #${b.id}: ${simPct}%`);
//             } else {
//               console.log(`ℹ️ Similarity between #${a.id} and #${b.id}: ${simPct}%`);
//             }
//           }
//         }
//       }
//     }
//     console.log('✅ Similarity checks finished');
//   } catch (err) {
//     console.error('❌ Error during similarity checks:', err);
//   }
// }
