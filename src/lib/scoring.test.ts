import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { scoreAndRankProducts, parseRequirementsFromText } from './scoring';
import { activeCategoryConfig } from '../config/category.config';
import { Product, ExtractedFaceTraits, UserRequirements } from '../types';

describe('CosmicPick Scoring & Recommendation Engine', () => {
  // Test Mock Data
  const baseTraits: ExtractedFaceTraits = {
    faceShape: { value: 'oval', confidence: 90, label: 'Oval' },
    skinTone: { value: 'medium', confidence: 88, label: 'Medium' },
    skinUndertone: { value: 'warm', confidence: 85, label: 'Warm' },
    visibleConcerns: [
      { concern: 'oiliness', level: 'high', confidence: 85, label: 'T-Zone Shine / Sebum' },
      { concern: 'redness', level: 'low', confidence: 80, label: 'Surface Flushing / Redness' },
      { concern: 'dark_circles', level: 'low', confidence: 75, label: 'Periorbital Shadowing' },
      { concern: 'dryness', level: 'low', confidence: 70, label: 'Moisture Barrier Deficit' },
    ],
    lightingQuality: 'optimal',
    lightingConfidence: 95,
  };

  const sampleProducts: Product[] = [
    {
      id: 'prod-oil-clean',
      name: 'Niacinamide Sebum Control Gel',
      brand: 'CleanDerm',
      category: 'Serum',
      priceINR: 600,
      rating: 4.8,
      buyUrl: 'https://example.com/products/p1',
      skinTypes: ['oily', 'combination'],
      targetedConcerns: ['oiliness', 'acne'],
      keyIngredients: ['Niacinamide 10%', 'Zinc PCA 1%'],
      avoidFlags: [],
      description: 'Oil balancing serum.',
      volumeOrWeight: '30 ml',
    },
    {
      id: 'prod-fragranced',
      name: 'Luxury Perfumed Floral Cream',
      brand: 'AromaBeauty',
      category: 'Moisturizer',
      priceINR: 1200,
      rating: 4.5,
      buyUrl: 'https://example.com/products/p2',
      skinTypes: ['dry', 'normal'],
      targetedConcerns: ['dryness'],
      keyIngredients: ['Rose Essential Oil', 'Shea Butter'],
      avoidFlags: ['fragrance', 'essential_oils'],
      description: 'Deep hydrating floral cream.',
      volumeOrWeight: '50 g',
    },
    {
      id: 'prod-expensive',
      name: 'Prestige Cellular Recovery Ampoule',
      brand: 'StellarCure',
      category: 'Serum',
      priceINR: 4200,
      rating: 4.9,
      buyUrl: 'https://example.com/products/p3',
      skinTypes: ['normal', 'oily'],
      targetedConcerns: ['oiliness', 'anti_aging'],
      keyIngredients: ['Copper Peptides', 'Resveratrol'],
      avoidFlags: [],
      description: 'Luxury anti-aging ampoule.',
      volumeOrWeight: '30 ml',
    },
  ];

  // 1. Weight Sum Test
  it('should ensure category scoring weights sum exactly to 1.0', () => {
    const weights = activeCategoryConfig.scoringWeights;
    const sum =
      weights.traitMatchWeight +
      weights.concernMatchWeight +
      weights.requirementMatchWeight +
      weights.budgetFitWeight +
      weights.ratingWeight;

    assert.ok(
      Math.abs(sum - 1.0) < 0.0001,
      `Scoring weights sum must be 1.0, received ${sum}`
    );
  });

  // 2. Avoid-Ingredient Penalty & Warnings Test
  it('should penalize products containing avoided ingredients and flag conflict warnings', () => {
    const reqsWithAvoid: UserRequirements = {
      rawQuery: 'strictly fragrance-free',
      budgetMax: 2000,
      targetedConcerns: ['dryness'],
      avoidIngredients: ['fragrance'],
      productTypes: ['moisturizer'],
    };

    const results = scoreAndRankProducts(sampleProducts, baseTraits, reqsWithAvoid);
    const fragrancedResult = results.find((r) => r.product.id === 'prod-fragranced');

    assert.ok(fragrancedResult, 'Fragranced product must be present in scored results');
    assert.ok(
      fragrancedResult.conflictWarnings.length > 0,
      'Fragranced product must have conflict warnings'
    );
    assert.match(
      fragrancedResult.conflictWarnings[0].toLowerCase(),
      /fragrance/,
      'Warning should mention fragrance'
    );

    // Score comparison without avoid flag
    const reqsWithoutAvoid: UserRequirements = {
      ...reqsWithAvoid,
      avoidIngredients: [],
    };
    const resultsNoAvoid = scoreAndRankProducts(sampleProducts, baseTraits, reqsWithoutAvoid);
    const fragrancedResultNoAvoid = resultsNoAvoid.find((r) => r.product.id === 'prod-fragranced');

    assert.ok(
      fragrancedResult.matchScore < (fragrancedResultNoAvoid?.matchScore || 0),
      `Match score with avoid penalty (${fragrancedResult.matchScore}) must be strictly lower than without penalty (${fragrancedResultNoAvoid?.matchScore})`
    );
  });

  // 3. Budget Fit Test
  it('should award high budget score within budget and penalize over-budget products', () => {
    const budgetLimit = 1500;
    const reqs: UserRequirements = {
      rawQuery: 'budget under 1500',
      budgetMax: budgetLimit,
      targetedConcerns: ['oiliness'],
      avoidIngredients: [],
      productTypes: ['serum'],
    };

    const results = scoreAndRankProducts(sampleProducts, baseTraits, reqs);
    const affordableResult = results.find((r) => r.product.id === 'prod-oil-clean'); // ₹600
    const expensiveResult = results.find((r) => r.product.id === 'prod-expensive');  // ₹4200

    assert.ok(affordableResult && expensiveResult, 'Both products must be scored');
    assert.ok(
      affordableResult.scoreBreakdown.budgetScore >= 90,
      `Affordable product budget score should be >= 90, got ${affordableResult.scoreBreakdown.budgetScore}`
    );
    assert.ok(
      expensiveResult.scoreBreakdown.budgetScore < 50,
      `Over-budget product budget score should decay < 50, got ${expensiveResult.scoreBreakdown.budgetScore}`
    );
    assert.ok(
      affordableResult.scoreBreakdown.budgetScore > expensiveResult.scoreBreakdown.budgetScore,
      'Affordable product must have higher budget score than expensive one'
    );
  });

  // 4. Trait Match Test
  it('should increase trait compatibility score for detected oiliness', () => {
    const oilyReqs: UserRequirements = {
      rawQuery: 'serum for face',
      budgetMax: 2000,
      targetedConcerns: [],
      avoidIngredients: [],
      productTypes: ['serum'],
    };

    const results = scoreAndRankProducts(sampleProducts, baseTraits, oilyReqs);
    const oilyClean = results.find((r) => r.product.id === 'prod-oil-clean');

    assert.ok(oilyClean, 'Product must be found');
    assert.ok(
      oilyClean.scoreBreakdown.traitScore >= 85,
      `Trait score should be elevated for matching skin type, got ${oilyClean.scoreBreakdown.traitScore}`
    );
    assert.ok(
      oilyClean.highlightBadges.includes('Controls Sebum'),
      'Should include "Controls Sebum" highlight badge'
    );
  });

  // 5. Conversational Text Parser Test
  it('should parse budget, concerns, avoid ingredients, and product types from free text', () => {
    const raw = 'oily skin, prone to breakouts, budget under 1200, strictly fragrance-free daily serum';
    const parsed = parseRequirementsFromText(raw);

    assert.equal(parsed.budgetMax, 1200, 'Budget should be extracted as 1200');
    assert.ok(parsed.targetedConcerns.includes('oiliness'), 'Should detect oiliness concern');
    assert.ok(parsed.targetedConcerns.includes('acne'), 'Should detect acne concern');
    assert.ok(parsed.avoidIngredients.includes('fragrance'), 'Should detect fragrance avoid flag');
    assert.ok(parsed.productTypes.includes('serum'), 'Should detect serum product type');
  });
});
