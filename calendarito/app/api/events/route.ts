import { getOAuthClient, nextDay } from '@/lib/google';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

interface EventRow {
  name: string;
  topic: string;
  date: string;
}

interface EventsPayload {
  events: EventRow[];
  calendarId: string;
  colorId: string;
  notifyDays: number;
  notifyHour: number;
}

export async function POST(req: NextRequest) {
  const tokenCookie = req.cookies.get('g_token');
  if (!tokenCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: EventsPayload = await req.json();
  const { events, calendarId, colorId, notifyDays, notifyHour } = body;

  if (!events?.length || !calendarId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // minutes before midnight of event day = X days before at Y hour
  const notifyMinutes = notifyDays * 24 * 60 - notifyHour * 60;

  try {
    const client = getOAuthClient();
    client.setCredentials(JSON.parse(tokenCookie.value));
    const calendar = google.calendar({ version: 'v3', auth: client });

    const created = [];
    for (const row of events) {
      const event = {
        summary: `${row.topic} - ${row.name}`,
        colorId,
        start: { date: row.date },
        end: { date: nextDay(row.date) },
        reminders: {
          useDefault: false,
          overrides: [{ method: 'email', minutes: notifyMinutes }],
        },
      };
      const res = await calendar.events.insert({ calendarId, requestBody: event });
      const inserted = (res as { data: { htmlLink?: string } }).data;
      created.push({ summary: event.summary, date: row.date, link: inserted.htmlLink });
    }

    return NextResponse.json({ created });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
