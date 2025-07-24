import fs from 'fs/promises';
import path from 'path';
import { compareTextSimilarity } from '../utils/compareText';
import { convertAllToText } from '../utils/convertToText';
import { extractZip } from '../utils/extractZip';
import { SERVICES } from '../config/services.config';

const TEMP_DIR = path.join(__dirname, '../../tmp');
const LIVRABLE_URL = SERVICES.livrables;

export async function detectSimilarityForDeliverable(projectId: number) {

  const textMap = new Map<number, string>();
  const response = await fetch(`${LIVRABLE_URL}/project/${projectId}`);
  let comparisons: any[] = [];
  if (response.status !== 200) {
    throw new Error(`Error fetching deliverables for project ${projectId}`);
  }
  const deliverables = await response.json();
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

      const data = {
        deliverableId: a.id,
        submissionAId: a.id,
        submissionBId: b.id,
        score,
      };

      try{
        const comparisonResponse = await fetch(`${LIVRABLE_URL}/similarity`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!comparisonResponse.ok) {
          throw new Error(`Error saving similarity comparison for ${a.id} and ${b.id}`);
        }
        const comparisonData = await comparisonResponse.json();
        comparisons.push(comparisonData);
        console.log(`↔️ Similarity between #${a.id} and #${b.id}: ${(score * 100).toFixed(2)}%`);
        a.similarityRate = Math.max(a.similarityRate || 0, score);
        b.similarityRate = Math.max(b.similarityRate || 0, score);
      
        console.log(`↔️ Similarity between #${a.id} and #${b.id}: ${(score * 100).toFixed(2)}%`);

      }catch (error) {
        console.error(`❌ Error saving similarity comparison for ${a.id} and ${b.id}:`, error);
      }
    }
  }
  return comparisons;
}
