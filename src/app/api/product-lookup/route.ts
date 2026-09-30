import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { searchOpenBeautyFacts } from '@/lib/obf-client';

const QuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(3, { message: 'Query must be at least 3 characters long' })
    .max(80, { message: 'Query must not exceed 80 characters' })
    .transform((val) => val.replace(/[\r\n\t]/g, ' ')),
});

export async function GET(req: NextRequest) {
  // IP rate limiting using existing rate limiter
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  const rateCheck = checkRateLimit(ip, 30, 60000);
  if (!rateCheck.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please wait a moment before searching again.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
        },
      }
    );
  }

  const { searchParams } = new URL(req.url);
  const qParam = searchParams.get('q');

  const parsed = QuerySchema.safeParse({ q: qParam || '' });
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Invalid search query';
    return NextResponse.json(
      {
        error: 'Bad Request',
        message: errorMsg,
        results: [],
      },
      { status: 400 }
    );
  }

  const { q } = parsed.data;

  try {
    const results = await searchOpenBeautyFacts(q, 6);

    return NextResponse.json(
      {
        query: q,
        count: results.length,
        results,
        disclaimer: 'Ingredients data from Open Beauty Facts (ODbL).',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      }
    );
  } catch (err) {
    console.error('Error in product-lookup endpoint:', err);
    return NextResponse.json(
      {
        error: 'Service Error',
        message: 'Failed to look up products. Please try again later.',
        results: [],
      },
      { status: 500 }
    );
  }
}
