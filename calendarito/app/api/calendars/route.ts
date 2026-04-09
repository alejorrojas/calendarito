import { getOAuthClient } from '@/lib/google';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  const bearerToken = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  const providerToken =
    session?.provider_token ??
    req.headers.get('x-provider-token') ??
    (bearerToken || null);

  if (!providerToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = getOAuthClient();
    client.setCredentials({ access_token: providerToken });
    const calendar = google.calendar({ version: 'v3', auth: client });
    const res = await calendar.calendarList.list();
    const calendars = (res.data.items ?? []).map(c => ({ id: c.id, name: c.summary }));
    return NextResponse.json({ calendars });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
