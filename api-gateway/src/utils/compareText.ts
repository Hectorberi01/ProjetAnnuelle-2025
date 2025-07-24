import stringSimilarity from 'string-similarity';

export function compareTextSimilarity(a: string, b: string): number {
  return stringSimilarity.compareTwoStrings(a, b); // retourne un score entre 0 et 1
}
