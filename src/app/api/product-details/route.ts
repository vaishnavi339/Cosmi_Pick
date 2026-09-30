import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { getProductByBarcode } from '@/lib/obf-client';

const BarcodeSchema = z.object({
  barcode: z
    .string()
    .trim()
    .regex(/^\d{8,14}$/, { message: 'Barcode must be between 8 and 14 digits' }),
});

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  const rateCheck = checkRateLimit(ip, 60, 60000);
  if (!rateCheck.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please wait a moment before trying again.',
      },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(req.url);
  const barcodeParam = searchParams.get('barcode');

  const parsed = BarcodeSchema.safeParse({ barcode: barcodeParam || '' });
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Invalid barcode';
    return NextResponse.json(
      { error: 'Bad Request', message: errorMsg },
      { status: 400 }
    );
  }

  const { barcode } = parsed.data;

  try {
    const product = await getProductByBarcode(barcode);

    if (!product) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: `Product with barcode ${barcode} not found in Open Beauty Facts.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        product,
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
    console.error('Error fetching product details:', err);
    return NextResponse.json(
      { error: 'Service Error', message: 'Failed to retrieve product details.' },
      { status: 500 }
    );
  }
}
