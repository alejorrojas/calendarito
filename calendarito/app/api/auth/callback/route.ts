import { getOAuthClient } from '@/lib/google';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', req.url));
  }

  try {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);

    const res = NextResponse.redirect(new URL('/app', req.url));
    res.cookies.set('g_token', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return res;
  } catch {
    return NextResponse.redirect(new URL('/?error=auth_failed', req.url));
  }
}
