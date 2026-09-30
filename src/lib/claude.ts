import { z } from 'zod';
import { ExtractedFaceTraits, UserRequirements, Product } from '@/types';
import { parseRequirementsFromText } from './scoring';

// Zod Schema for Claude Filter extraction with automatic clamping
export const ClaudeFilterSchema = z.object({
  budgetMax: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
        val = isNaN(parsed) ? 1500 : parsed;
      }
      if (typeof val !== 'number' || isNaN(val)) return 1500;
      // Clamp between ₹300 and ₹10,000
      return Math.min(10000, Math.max(300, Math.round(val)));
    }),
  targetedConcerns: z
    .array(z.string())
    .optional()
    .default([])
    .transform((arr) => arr.map((s) => s.toLowerCase().trim())),
  avoidIngredients: z
    .array(z.string())
    .optional()
    .default([])
    .transform((arr) => arr.map((s) => s.toLowerCase().trim())),
  productTypes: z
    .array(z.string())
    .optional()
    .default([])
    .transform((arr) => arr.map((s) => s.toLowerCase().trim())),
  userPriorities: z.array(z.string()).optional(),
});

// Zod Schema for Claude explanations mapping product IDs to 2-3 sentence strings
export const ClaudeExplanationSchema = z.record(
  z.string(),
  z.string().min(10, 'Explanation too brief')
);

/**
 * Calls Anthropic Claude API to parse natural language text + traits into structured filters.
 * Validates with Zod, clamps numbers, and gracefully falls back to deterministic regex parser.
 */
export async function parseRequirementsWithClaude(
  userText: string,
  traits: ExtractedFaceTraits,
  existingReqs?: Partial<UserRequirements>
): Promise<UserRequirements> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_api_key_here')) {
    // Deterministic fallback
    return parseRequirementsFromText(userText, existingReqs);
  }

  const systemPrompt = `You are a clinical dermal AI assistant for CosmicPick.
Your job is to parse the user's natural language preferences and facial analysis traits into structured product recommendation filters.
Return ONLY valid JSON matching this schema:
{
  "budgetMax": number (in INR, default 1500 if not specified),
  "targetedConcerns": string[] (subset of: ["acne", "oiliness", "hyperpigmentation", "redness", "dryness", "dark_circles", "anti_aging", "barrier_repair", "dullness", "clogged_pores"]),
  "avoidIngredients": string[] (subset of: ["fragrance", "essential_oils", "drying_alcohol", "sulfates", "parabens", "silicones", "comedogenic_oils"]),
  "productTypes": string[] (subset of: ["cleanser", "serum", "moisturizer", "sunscreen", "toner", "treatment"])
}`;

  const userPrompt = `User Stated Query: "${userText}"
Detected Face Traits:
- Skin Tone: ${traits.skinTone.value}
- Undertone: ${traits.skinUndertone.value}
- Visible Concerns: ${traits.visibleConcerns.map((c) => `${c.label} (${c.level})`).join(', ')}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 400,
        temperature: 0.1,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`Claude API returned status ${res.status}, falling back to deterministic parser.`);
      return parseRequirementsFromText(userText, existingReqs);
    }

    const data = await res.json();
    const replyText = data.content?.[0]?.text || '';
    const cleaned = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
    const rawParsed = JSON.parse(cleaned);

    // Zod validation with clamping
    const zodResult = ClaudeFilterSchema.safeParse(rawParsed);
    if (!zodResult.success) {
      console.warn('Claude output failed Zod schema validation:', zodResult.error);
      return parseRequirementsFromText(userText, existingReqs);
    }

    const validated = zodResult.data;

    return {
      rawQuery: userText,
      budgetMax: validated.budgetMax || existingReqs?.budgetMax || 1500,
      targetedConcerns: validated.targetedConcerns.length > 0 ? validated.targetedConcerns : existingReqs?.targetedConcerns || [],
      avoidIngredients: validated.avoidIngredients.length > 0 ? validated.avoidIngredients : existingReqs?.avoidIngredients || [],
      productTypes: validated.productTypes.length > 0 ? validated.productTypes : existingReqs?.productTypes || [],
      additionalNotes: userText,
    };
  } catch (err) {
    console.warn('Claude API call error or timeout, proceeding with deterministic parser:', err);
    return parseRequirementsFromText(userText, existingReqs);
  }
}

/**
 * Generates custom AI explanations for top products using Claude.
 * Validates with Zod; returns null on failure so caller falls back to deterministic templates.
 */
export async function generateExplanationsWithClaude(
  topProducts: { product: Product; matchScore: number }[],
  traits: ExtractedFaceTraits,
  reqs: UserRequirements
): Promise<Record<string, string> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_api_key_here')) {
    return null;
  }

  const prompt = `You are a cosmetic scientist writing personalized product explanations for CosmicPick.
For each product below, write 2 to 3 sentences explaining specifically why it matches this user's facial traits and needs.
Reference their detected traits (${traits.skinTone.value} tone, ${traits.visibleConcerns.filter((c) => c.level !== 'low').map((c) => c.label).join(', ')}) and budget (₹${reqs.budgetMax}).
Be specific, professional, and clear. Do not make medical diagnoses.

Products:
${topProducts
  .map(
    (p, i) =>
      `${i + 1}. ID: ${p.product.id}, Name: ${p.product.name} by ${p.product.brand}, Price: ₹${p.product.priceINR}, Actives: ${p.product.keyIngredients.join(', ')}`
  )
  .join('\n')}

Return a valid JSON object mapping product ID to explanation string:
{
  "prod-id": "2-3 sentence personalized explanation..."
}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 800,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    const replyText = data.content?.[0]?.text || '';
    const cleaned = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
    const rawParsed = JSON.parse(cleaned);

    const zodResult = ClaudeExplanationSchema.safeParse(rawParsed);
    if (!zodResult.success) {
      console.warn('Claude explanations failed Zod validation:', zodResult.error);
      return null;
    }

    return zodResult.data;
  } catch (err) {
    console.warn('Claude explanation generation failed, falling back to local template:', err);
    return null;
  }
}
