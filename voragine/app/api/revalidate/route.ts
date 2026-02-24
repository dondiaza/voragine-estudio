import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_PATHS = ['/', '/servicios', '/portfolio', '/sobre-nosotros', '/contacto', '/blog'];

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-revalidate-token');
  if (!token || token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: { paths?: string[] } = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const paths = Array.isArray(payload.paths) && payload.paths.length ? payload.paths : FALLBACK_PATHS;
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({
    revalidated: true,
    paths
  });
}
