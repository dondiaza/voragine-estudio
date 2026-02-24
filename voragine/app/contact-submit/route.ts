import { NextRequest, NextResponse } from 'next/server';

const backendApiUrl =
  process.env.CMS_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://backend-vg.vercel.app/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${backendApiUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'No se pudo conectar con el servicio de contacto',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 502 }
    );
  }
}
