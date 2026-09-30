import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  normalizeString,
  brandMatches,
  computeNameSimilarity,
  evaluateCandidateMatch,
} from './name-matching';

describe('Name Matching Utilities', () => {
  it('normalizes strings by stripping diacritics, punctuation, and extra spaces', () => {
    assert.strictEqual(normalizeString('  Crème  Légère! 10%  '), 'creme legere 10');
    assert.strictEqual(normalizeString('CeraVe® Hydrating Cleanser'), 'cerave hydrating cleanser');
  });

  it('matches brands with casing and alias variations', () => {
    assert.strictEqual(brandMatches('Minimalist', 'Be Minimalist'), true);
    assert.strictEqual(brandMatches('The Ordinary', 'Ordinary'), true);
    assert.strictEqual(brandMatches('CeraVe', 'cerave'), true);
    assert.strictEqual(brandMatches('Neutrogena', 'CeraVe'), false);
  });

  it('computes high similarity for identical and very close product names', () => {
    const scoreExact = computeNameSimilarity(
      'Salicylic Acid 2% Face Cleanser',
      'Salicylic Acid 2% Face Cleanser'
    );
    assert.strictEqual(scoreExact, 1.0);

    const scoreClose = computeNameSimilarity(
      'Niacinamide 10% + Zinc 1% Serum',
      'Niacinamide 10% + Zinc 1%'
    );
    assert.ok(scoreClose >= 0.8, `Expected scoreClose >= 0.8, got ${scoreClose}`);
  });

  it('computes low similarity for distinct products from the same brand', () => {
    const scoreDiff = computeNameSimilarity(
      'Salicylic Acid 2% Face Cleanser',
      'Hyaluronic Acid 2% + B5 Serum'
    );
    assert.ok(scoreDiff < 0.5, `Expected scoreDiff < 0.5, got ${scoreDiff}`);
  });

  it('strictly evaluates matches requiring both brand match and threshold >= 0.8', () => {
    const match = evaluateCandidateMatch(
      { brand: 'CeraVe', name: 'Hydrating Facial Cleanser' },
      { brand: 'CeraVe', name: 'Hydrating Facial Cleanser' },
      0.8
    );
    assert.strictEqual(match.brandMatched, true);
    assert.strictEqual(match.isMatch, true);
    assert.strictEqual(match.similarity, 1.0);

    const wrongBrand = evaluateCandidateMatch(
      { brand: 'CeraVe', name: 'Hydrating Facial Cleanser' },
      { brand: 'Cetaphil', name: 'Hydrating Facial Cleanser' },
      0.8
    );
    assert.strictEqual(wrongBrand.isMatch, false);
    assert.strictEqual(wrongBrand.brandMatched, false);
  });
});
