import { NextRequest, NextResponse } from 'next/server';
import productsData from '@/data/products.json';
import { Product, ExtractedFaceTraits, UserRequirements } from '@/types';
import { scoreAndRankProducts } from '@/lib/scoring';
import { parseRequirementsWithClaude, generateExplanationsWithClaude } from '@/lib/claude';
import { checkRateLimit } from '@/lib/rate-limit';
import { activeCategoryConfig } from '@/config/category.config';
import { selectRoutineRecommendations } from '@/lib/routine-recommendations';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by IP
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'anonymous-user';
    const rateCheck = checkRateLimit(ip, 30, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { traits, rawText = '', manualRequirements = {} } = body as {
      traits: ExtractedFaceTraits;
      rawText?: string;
      manualRequirements?: Partial<UserRequirements>;
    };

    if (!traits || !traits.skinTone || !traits.faceShape) {
      return NextResponse.json(
        { error: 'Missing required face traits in request payload.' },
        { status: 400 }
      );
    }

    // 2. Parse requirements via Claude (or deterministic fallback)
    const parsedRequirements = await parseRequirementsWithClaude(
      rawText,
      traits,
      manualRequirements
    );

    // Merge any manual chips passed explicitly
    if (manualRequirements.targetedConcerns && manualRequirements.targetedConcerns.length > 0) {
      parsedRequirements.targetedConcerns = Array.from(
        new Set([...parsedRequirements.targetedConcerns, ...manualRequirements.targetedConcerns])
      );
    }
    if (manualRequirements.avoidIngredients && manualRequirements.avoidIngredients.length > 0) {
      parsedRequirements.avoidIngredients = Array.from(
        new Set([...parsedRequirements.avoidIngredients, ...manualRequirements.avoidIngredients])
      );
    }
    if (manualRequirements.productTypes && manualRequirements.productTypes.length > 0) {
      parsedRequirements.productTypes = Array.from(
        new Set([...parsedRequirements.productTypes, ...manualRequirements.productTypes])
      );
    }
    if (manualRequirements.budgetMax && manualRequirements.budgetMax > 0) {
      parsedRequirements.budgetMax = manualRequirements.budgetMax;
    }

    // 3. Multi-factor scoring across all 40 products
    const products = productsData as unknown as Product[];
    const rankedRecommendations = scoreAndRankProducts(
      products,
      traits,
      parsedRequirements,
      activeCategoryConfig
    );

    // Take top 5
    const top5 = rankedRecommendations.slice(0, 5);
    const routinePicks = selectRoutineRecommendations(rankedRecommendations);

    // 4. Try generating custom AI explanations with Claude for top 5
    const claudeExplanations = await generateExplanationsWithClaude(
      top5.map((r) => ({ product: r.product, matchScore: r.matchScore })),
      traits,
      parsedRequirements
    );

    if (claudeExplanations) {
      top5.forEach((item) => {
        if (claudeExplanations[item.product.id]) {
          item.aiExplanation = claudeExplanations[item.product.id];
        }
      });
    }

    return NextResponse.json({
      success: true,
      recommendations: routinePicks,
      // The routine builder needs category coverage beyond the five general picks.
      routineRecommendations: rankedRecommendations,
      allCount: rankedRecommendations.length,
      parsedRequirements,
      scoringWeights: activeCategoryConfig.scoringWeights,
    });
  } catch (error: any) {
    console.error('API /api/recommend error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during recommendation generation.' },
      { status: 500 }
    );
  }
}
