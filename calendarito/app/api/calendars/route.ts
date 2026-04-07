import { getOAuthClient } from '@/lib/google';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const tokenCookie = req.cookies.get('g_token');
  if (!tokenCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const client = getOAuthClient();
    client.setCredentials(JSON.parse(tokenCookie.value));

    const calendar = google.calendar({ version: 'v3', auth: client });
    const res = await calendar.calendarList.list();

    const calendars = (res.data.items ?? []).map(c => ({
      id: c.id,
      name: c.summary,
    }));

    return NextResponse.json({ calendars });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch calendars' }, { status: 500 });
  }
}
