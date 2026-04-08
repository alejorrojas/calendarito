import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('g_token');
  return NextResponse.json({ authenticated: !!token });
}
