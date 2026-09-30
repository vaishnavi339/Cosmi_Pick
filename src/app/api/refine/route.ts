import { NextRequest, NextResponse } from 'next/server';
import productsData from '@/data/products.json';
import { Product, ExtractedFaceTraits, UserRequirements } from '@/types';
import { scoreAndRankProducts } from '@/lib/scoring';
import { checkRateLimit } from '@/lib/rate-limit';
import { activeCategoryConfig } from '@/config/category.config';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'anonymous-user';
    const rateCheck = checkRateLimit(ip, 40, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      traits,
      requirements,
      refinementQuery,
    } = body as {
      traits: ExtractedFaceTraits;
      requirements: UserRequirements;
      refinementQuery: string;
    };

    if (!traits || !requirements || !refinementQuery) {
      return NextResponse.json(
        { error: 'Missing traits, requirements, or refinement query.' },
        { status: 400 }
      );
    }

    const products = productsData as unknown as Product[];
    const rankedRecommendations = scoreAndRankProducts(
      products,
      traits,
      requirements,
      activeCategoryConfig,
      refinementQuery
    );

    const top5 = rankedRecommendations.slice(0, 5);

    return NextResponse.json({
      success: true,
      recommendations: top5,
      appliedRefinement: refinementQuery,
    });
  } catch (error: any) {
    console.error('API /api/refine error:', error);
    return NextResponse.json(
      { error: error.message || 'Error executing conversational refinement.' },
      { status: 500 }
    );
  }
}
