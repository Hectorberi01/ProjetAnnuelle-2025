import { AppDataSource } from '../config/database';
import { Deliverable } from '../entities/Deliverable';
import { extractZip } from '../utils/extractZip';
import { convertAllToText } from '../utils/convertToText';
import { compareTextSimilarity } from '../utils/compareText';
import fs from 'fs/promises';
import path from 'path';
import { SimilarityComparison } from '../entities/SimilarityComparison';

const TEMP_DIR = path.join(__dirname, '../../tmp');

export async function detectSimilarityForDeliverable(projectId: number) {
  const deliverableRepo = AppDataSource.getRepository(Deliverable);
  const comparisonRepo = AppDataSource.getRepository(SimilarityComparison);

  const deliverables = await deliverableRepo.find({ where: { projectId } });

  const textMap = new Map<number, string>();

  for (const deliverable of deliverables) {
    console.log(`🔍 Processing deliverable #${deliverable}`);
    if (!deliverable.fileUrl) continue;

    const localFolder = path.join(TEMP_DIR, `deliverable_${deliverable.id}`);

    console.log(`📥 Downloading and extracting deliverable #${deliverable.id}...`)  ;
    await fs.mkdir(localFolder, { recursive: true });
    await extractZip(deliverable.fileUrl, localFolder);

    const text = await convertAllToText(localFolder);
    textMap.set(deliverable.id, text);
  }

  for (let i = 0; i < deliverables.length; i++) {
    for (let j = i + 1; j < deliverables.length; j++) {
      const a = deliverables[i];
      const b = deliverables[j];

      const textA = textMap.get(a.id) || '';
      const textB = textMap.get(b.id) || '';

      const score = compareTextSimilarity(textA, textB);

      a.similarityRate = Math.max(a.similarityRate || 0, score);
      b.similarityRate = Math.max(b.similarityRate || 0, score);

      await comparisonRepo.save({
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

  await deliverableRepo.save(deliverables);
  console.log('✅ Similarity detection complete');
}
