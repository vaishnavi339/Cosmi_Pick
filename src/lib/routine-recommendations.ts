import { RecommendationResult } from '@/types';

/** Pick a few highest-ranked options for every core skincare routine category. */
export function selectRoutineRecommendations(
  ranked: RecommendationResult[],
  perCategory = 3
): RecommendationResult[] {
  const categories: Array<(category: string) => boolean> = [
    (category) => category.includes('cleanser') || category.includes('cleanse'),
    (category) => category.includes('serum') || category.includes('treatment'),
    (category) => category.includes('moistur') || category.includes('cream') || category.includes('gel'),
    (category) => category.includes('sunscreen') || category.includes('spf'),
  ];
  const selected = new Map<string, RecommendationResult>();

  for (const matches of categories) {
    let count = 0;
    for (const result of ranked) {
      if (matches(result.product.category.toLowerCase()) && !selected.has(result.product.id)) {
        selected.set(result.product.id, result);
        if (++count >= perCategory) break;
      }
    }
  }

  // Preserve the overall highest-scoring option as the hero even if its category is optional.
  if (ranked[0] && !selected.has(ranked[0].product.id)) selected.set(ranked[0].product.id, ranked[0]);
  return Array.from(selected.values()).sort((a, b) => ranked.indexOf(a) - ranked.indexOf(b));
}
