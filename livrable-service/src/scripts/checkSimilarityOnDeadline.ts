import { AppDataSource } from '../config/database';
import { Deliverable } from '../entities/Deliverable';
import { Submission } from '../entities/Submission';
import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import stringSimilarity from 'string-similarity';

const TEMP_DIR = path.join(__dirname, '../../tmp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// Function to extract a zip file
// using AdmZip
// https://www.npmjs.com/package/adm-zip
function extractZip(zipPath: string, extractTo: string) {
  const zip = new AdmZip(zipPath);
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

function getAllTextFiles(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
  
    return entries.flatMap(entry => {
      const fullPath = path.join(dir, entry.name);
  
      if (entry.isDirectory()) {
        // 🔒 Dossiers à ignorer
        if (['node_modules', 'dist', '.git', '.next', 'build'].includes(entry.name)) return [];
  
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

function compareDirs(dirA: string, dirB: string): number {
  const filesA = getAllTextFiles(dirA);
  const filesB = getAllTextFiles(dirB);
  let score = 0;
  let count = 0;
  console.log(`📄 Comparing ${filesA.length}x${filesB.length} files`);
  for (const fileA of filesA) {
    const contentA = fs.readFileSync(fileA, 'utf-8');
    for (const fileB of filesB) {
      const contentB = fs.readFileSync(fileB, 'utf-8');
      score += stringSimilarity.compareTwoStrings(contentA, contentB);
      count++;
    }
  }
  return count > 0 ? score / count : 0;
}

export async function checkSimilarityOnDeadline() {

  const deliverableRepo = AppDataSource.getRepository(Deliverable);
  const submissionRepo = AppDataSource.getRepository(Submission);

  const now = new Date();
  const deliverables = await deliverableRepo.find({ where: {} });

  console.log('Deliverables:', deliverables.map(d => ({ id: d.id, deadline: d.deadline })));
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (const d of deliverables) {
    
    const deadline = new Date(d.deadline);
    console.log(`🕒 Checking deliverable #${d.id} with deadline ${deadline}`);
    //if (deadline.getTime() === todayMidnight.getTime()) {
    if (now >= deadline) {
      const submissions = await submissionRepo.find({ where: { deliverable: { id: d.id } } });
      const zipSubs = submissions.filter(s => s.fileUrl && s.fileUrl.endsWith('.zip'));

      const folders: { id: number; path: string }[] = [];

      for (const s of zipSubs) {
        const folderPath = path.join(TEMP_DIR, `submission_${s.id}`);
        extractZip(s.fileUrl!, folderPath);
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

            const a = await submissionRepo.findOneBy({ id: folders[i].id });
            const b = await submissionRepo.findOneBy({ id: folders[j].id });

            if (a && b) {
                a.similarityRate = Math.max(a.similarityRate || 0, sim);
                b.similarityRate = Math.max(b.similarityRate || 0, sim);
                await submissionRepo.save([a, b]);

                if (sim >= 0.8) {
                    console.log(`⚠️ High similarity between #${a.id} and #${b.id} → ${(sim * 100).toFixed(1)}%`);
                } else {
                    console.log(`ℹ️ Similarity between #${a.id} and #${b.id} = ${(sim * 100).toFixed(1)}%`);
                }
            }
        }
      }
    }
  }

  console.log('✅ Similarity check finished');
  //process.exit(0);
}
