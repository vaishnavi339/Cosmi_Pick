/**
 * Name matching utilities for comparing product names and brands from external catalogs.
 */

export function normalizeString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s]/g, ' ') // replace punctuation with spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes brand names and checks if they match.
 */
export function brandMatches(productBrand: string, candidateBrand: string): boolean {
  if (!productBrand || !candidateBrand) return false;
  const a = normalizeString(productBrand);
  const b = normalizeString(candidateBrand);

  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;

  // Common aliases
  const aliases: Record<string, string[]> = {
    'minimalist': ['be minimalist', 'minimalist'],
    'the ordinary': ['ordinary', 'deciem', 'the ordinary'],
    'cerave': ['cerave', 'l oreal cerave'],
    'cetaphil': ['cetaphil', 'galderma'],
    'paulas choice': ['paula s choice', 'paulas choice'],
    'la roche posay': ['la roche posay', 'laroche posay', 'l oreal'],
    'neutrogena': ['neutrogena', 'johnson johnson'],
    'cosrx': ['cosrx'],
  };

  for (const [key, list] of Object.entries(aliases)) {
    const aMatches = a === key || list.includes(a);
    const bMatches = b === key || list.includes(b);
    if (aMatches && bMatches) return true;
  }

  return false;
}

/**
 * Calculates bigram-based Sorensen-Dice coefficient between two strings (0.0 to 1.0).
 */
export function diceCoefficient(str1: string, str2: string): number {
  const s1 = normalizeString(str1).replace(/\s/g, '');
  const s2 = normalizeString(str2).replace(/\s/g, '');

  if (s1 === s2) return 1.0;
  if (s1.length < 2 || s2.length < 2) return 0.0;

  const getBigrams = (str: string) => {
    const bigrams = new Map<string, number>();
    for (let i = 0; i < str.length - 1; i++) {
      const bigram = str.substring(i, i + 2);
      bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
    }
    return bigrams;
  };

  const b1 = getBigrams(s1);
  const b2 = getBigrams(s2);

  let intersection = 0;
  for (const [bigram, count1] of b1.entries()) {
    if (b2.has(bigram)) {
      intersection += Math.min(count1, b2.get(bigram)!);
    }
  }

  const total = (s1.length - 1) + (s2.length - 1);
  return (2.0 * intersection) / total;
}

/**
 * Token overlap (Jaccard on words).
 */
export function tokenSimilarity(str1: string, str2: string): number {
  const words1 = new Set(normalizeString(str1).split(' ').filter(w => w.length > 1));
  const words2 = new Set(normalizeString(str2).split(' ').filter(w => w.length > 1));

  if (words1.size === 0 || words2.size === 0) return 0;

  let intersection = 0;
  for (const w of words1) {
    if (words2.has(w)) intersection++;
  }

  const union = new Set([...words1, ...words2]).size;
  return intersection / union;
}

/**
 * Composite similarity score combining character bigrams and token overlap.
 */
export function computeNameSimilarity(nameA: string, nameB: string): number {
  if (!nameA || !nameB) return 0;
  const normA = normalizeString(nameA);
  const normB = normalizeString(nameB);

  if (normA === normB) return 1.0;

  const dice = diceCoefficient(normA, normB);
  const token = tokenSimilarity(normA, normB);

  // Weighted composite score (favoring token accuracy for skincare product names)
  return Math.round((dice * 0.4 + token * 0.6) * 100) / 100;
}

/**
 * Evaluates whether an Open Beauty Facts candidate is an acceptable match for a product.
 * Requires:
 * 1. Brand match
 * 2. Composite similarity >= threshold (default 0.8)
 */
export function evaluateCandidateMatch(
  product: { name: string; brand: string },
  candidate: { name: string; brand: string },
  threshold = 0.8
): { isMatch: boolean; similarity: number; brandMatched: boolean } {
  const brandMatched = brandMatches(product.brand, candidate.brand);
  if (!brandMatched) {
    return { isMatch: false, similarity: 0, brandMatched: false };
  }

  const similarity = computeNameSimilarity(product.name, candidate.name);
  return {
    isMatch: similarity >= threshold,
    similarity,
    brandMatched: true,
  };
}
