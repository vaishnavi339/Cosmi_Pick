import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = [
  'images.openbeautyfacts.org',
  'static.openbeautyfacts.org',
  'world.openbeautyfacts.org',
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return new NextResponse('Invalid url parameter', { status: 400 });
  }

  // Security: only proxy allowed Open Beauty Facts hosts to prevent SSRF
  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return new NextResponse('Host not allowed', { status: 403 });
  }

  try {
    const res = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'CosmicPick/1.0 (student portfolio project - contact: vaishnavi339@users.noreply.github.com)',
        Accept: 'image/webp,image/jpeg,image/png,image/*;q=0.8',
      },
    });

    if (!res.ok) {
      return new NextResponse('Image not found', { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Image-Source': 'Open Beauty Facts',
      },
    });
  } catch (err) {
    console.error('Error proxying product image:', err);
    return new NextResponse('Failed to proxy image', { status: 502 });
  }
}
