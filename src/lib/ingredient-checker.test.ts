import { describe, it } from 'node:test';
import assert from 'node:assert';
import { checkAvoidIngredients, detectActives } from './ingredient-checker';

describe('Ingredient Checker', () => {
  const sampleIngredients =
    'Aqua/Water, Glycerin, Niacinamide, Cetearyl Alcohol, Ceramide NP, Ceramide AP, Phytosphingosine, Hyaluronic Acid, Phenoxyethanol, Parfum/Fragrance, Methylparaben.';

  it('detects fragrance in ingredients text', () => {
    const result = checkAvoidIngredients(sampleIngredients, ['fragrance']);
    assert.strictEqual(result.passed, false);
    assert.strictEqual(result.matches.length, 1);
    assert.strictEqual(result.matches[0].ruleId, 'fragrance');
  });

  it('detects parabens in ingredients text', () => {
    const result = checkAvoidIngredients(sampleIngredients, ['parabens']);
    assert.strictEqual(result.passed, false);
    assert.strictEqual(result.matches[0].ruleId, 'parabens');
  });

  it('passes when no avoid ingredients are present', () => {
    const cleanIngredients =
      'Aqua, Glycerin, Niacinamide, Ceramide NP, Hyaluronic Acid, Squalane, Centella Asiatica.';
    const result = checkAvoidIngredients(cleanIngredients, ['fragrance', 'parabens', 'sulfates', 'alcohol']);
    assert.strictEqual(result.passed, true);
    assert.strictEqual(result.matches.length, 0);
  });

  it('does not falsely flag nourishing fatty alcohols (Cetearyl) as drying alcohol', () => {
    const result = checkAvoidIngredients(sampleIngredients, ['alcohol']);
    assert.strictEqual(result.passed, true);
  });

  it('detects beneficial actives accurately', () => {
    const actives = detectActives(sampleIngredients);
    const activeIds = actives.map((a) => a.id);
    assert.ok(activeIds.includes('niacinamide'), 'Should detect niacinamide');
    assert.ok(activeIds.includes('ceramides'), 'Should detect ceramides');
    assert.ok(activeIds.includes('hyaluronic'), 'Should detect hyaluronic acid');
  });
});
