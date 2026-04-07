'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const COLORS = [
  { id: '1', name: 'Lavender', swatchClass: 'bg-[#7986cb]' },
  { id: '2', name: 'Sage', swatchClass: 'bg-[#33b679]' },
  { id: '3', name: 'Grape', swatchClass: 'bg-[#8e24aa]' },
  { id: '4', name: 'Flamingo', swatchClass: 'bg-[#e67c73]' },
  { id: '5', name: 'Banana', swatchClass: 'bg-[#f6c026]' },
  { id: '6', name: 'Tangerine', swatchClass: 'bg-[#f5511d]' },
  { id: '7', name: 'Peacock', swatchClass: 'bg-[#039be5]' },
  { id: '8', name: 'Blueberry', swatchClass: 'bg-[#3f51b5]' },
  { id: '9', name: 'Basil', swatchClass: 'bg-[#0b8043]' },
  { id: '10', name: 'Tomato', swatchClass: 'bg-[#d60000]' },
  { id: '11', name: 'Flamingo', swatchClass: 'bg-[#e67c73]' },
];

interface EventRow { name: string; topic: string; date: string }
interface Calendar { id: string; name: string }

function parseCSV(text: string): EventRow[] {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  for (const col of ['name', 'topic', 'date']) {
    if (!headers.includes(col)) throw new Error(`El CSV debe tener la columna "${col}"`);
  }
  return lines.slice(1).map((line, i) => {
    const values = line.split(',').map(v => v.trim());
    const row = Object.fromEntries(headers.map((h, j) => [h, values[j] ?? ''])) as unknown as EventRow;
    if (!row.name || !row.topic) throw new Error(`Fila ${i + 2}: faltan campos`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) throw new Error(`Fila ${i + 2}: "date" debe ser YYYY-MM-DD`);
    return row;
  });
}

// ── Shared primitives ──────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 no-underline">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8E815]">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M7 11V3M7 3L3.5 6.5M7 3L10.5 6.5" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="font-heading text-[15px] font-bold tracking-[-0.03em] text-[#0A0A0A]">calendarito</span>
      <span className="rounded-full border border-[#DDD] px-[7px] py-px text-[10px] text-[#999]">beta</span>
    </Link>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="font-heading mb-2.5 text-xs font-semibold tracking-[0.06em] text-[#999] uppercase">{label}</p>
      {children}
    </div>
  );
}

function YellowBtn({ children, onClick, disabled = false }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-heading w-full cursor-pointer rounded-full border-none bg-[#E8E815] p-3.5 text-[15px] font-bold text-[#0A0A0A] transition-colors hover:bg-[#d4d512] disabled:cursor-not-allowed disabled:bg-[#E5E5E5] disabled:text-[#AAA] disabled:hover:bg-[#E5E5E5]"
    >
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="font-heading w-full cursor-pointer rounded-full border-[1.5px] border-[#DDD] bg-transparent p-[13px] text-sm font-semibold text-[#555] transition-colors hover:border-[#0A0A0A]"
    >
      {children}
    </button>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...restProps } = props;

  return (
    <input
      {...restProps}
      className={`w-full box-border rounded-xl border-[1.5px] border-[#E0E0E0] bg-[#FAFAFA] px-[14px] py-[11px] text-sm text-[#0A0A0A] outline-none transition-colors focus:border-[#0A0A0A] ${className ?? ''}`}
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AppPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [calendars, setCalendars]   = useState<Calendar[]>([]);
  const [events, setEvents]         = useState<EventRow[]>([]);
  const [csvError, setCsvError]     = useState('');
  const [calendarId, setCalendarId] = useState('');
  const [colorId, setColorId]       = useState('3');
  const [notifyDays, setNotifyDays] = useState(14);
  const [notifyHour, setNotifyHour] = useState(9);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<{ summary: string; date: string }[] | null>(null);
  const [error, setError]           = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/auth/status').then(r => r.json()).then(d => {
      setAuthenticated(d.authenticated);
      if (d.authenticated) fetchCalendars();
    });
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) setError('Error al autenticar con Google. Intentá de nuevo.');
  }, []);

  async function fetchCalendars() {
    const res = await fetch('/api/calendars');
    const data = await res.json();
    if (data.calendars) { setCalendars(data.calendars); setCalendarId(data.calendars[0]?.id ?? ''); }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvError(''); setEvents([]);
    const reader = new FileReader();
    reader.onload = ev => {
      try { setEvents(parseCSV(ev.target?.result as string)); }
      catch (err) { setCsvError(err instanceof Error ? err.message : 'Error al leer el CSV'); }
    };
    reader.readAsText(file);
  }

  async function handleSubmit() {
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/events', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events, calendarId, colorId, notifyDays, notifyHour }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.created);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear los eventos');
    } finally { setLoading(false); }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  if (authenticated === null) return null;
  if (!authenticated) { window.location.href = '/'; return null; }

  const cardClass = 'rounded-[20px] border border-[#EBEBEB] bg-white p-7 shadow-[0_1px_4px_rgba(0,0,0,0.06)]';

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-app)] bg-[radial-gradient(circle,var(--dot)_1px,transparent_1px)] [background-size:22px_22px]">

      {/* Top bar */}
      <div className="mx-auto box-border flex w-full max-w-[600px] items-center justify-between px-8 py-5">
        <Logo />
        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-full border-[1.5px] border-[#DDD] bg-transparent px-4 py-1.5 text-[13px] text-[#777] transition-colors hover:border-[#0A0A0A]"
        >
          Cerrar sesión →
        </button>
      </div>

      {/* Content */}
      <div className="box-border flex flex-1 justify-center px-6 pb-12">
        <div className="w-full max-w-[520px]">

          {error && (
            <div className="mb-4 rounded-xl border border-[#FFCDD2] bg-[#FFF0F0] px-4 py-3 text-[13px] text-[#C62828]">
              {error}
            </div>
          )}

          {/* ── Form ── */}
          {!result && (
            <div className="flex flex-col gap-3">

              {/* CSV */}
              <div className={cardClass}>
                <Section label="1 · Archivo CSV">
                  <div
                    onClick={() => fileRef.current?.click()}
                    className={`cursor-pointer rounded-[14px] border-[1.5px] border-dashed p-5 text-center transition-colors ${
                      events.length > 0
                        ? 'border-[#86EFAC] bg-[#F0FFF4]'
                        : 'border-[#DDD] hover:border-[#0A0A0A]'
                    }`}
                  >
                    {events.length > 0
                      ? <p className="font-heading text-sm font-bold text-[#15803D]">✓ {events.length} eventos cargados</p>
                      : <>
                          <p className="font-heading mb-1 text-sm font-semibold text-[#0A0A0A]">Seleccionar CSV</p>
                          <p className="text-xs text-[#999]">
                            Columnas: <code className="rounded bg-[#F3F3F3] px-[5px] py-px">name</code>, <code className="rounded bg-[#F3F3F3] px-[5px] py-px">topic</code>, <code className="rounded bg-[#F3F3F3] px-[5px] py-px">date</code>
                          </p>
                        </>
                    }
                  </div>
                  <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
                  {csvError && <p className="mt-2 text-xs text-[#C62828]">{csvError}</p>}
                  {events.length > 0 && (
                    <div className="mt-2.5 max-h-40 overflow-y-auto rounded-[10px] border border-[#F0F0F0]">
                      {events.map((e, i) => (
                        <div
                          key={i}
                          className={`flex justify-between px-3 py-[7px] ${i % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'} ${i < events.length - 1 ? 'border-b border-[#F5F5F5]' : ''}`}
                        >
                          <span className="text-xs">{e.topic} — {e.name}</span>
                          <span className="text-xs text-[#999]">{e.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>
              </div>

              {/* Calendar */}
              <div className={cardClass}>
                <Section label="2 · Calendario">
                  <select
                    value={calendarId}
                    onChange={e => setCalendarId(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-xl border-[1.5px] border-[#E0E0E0] bg-[#FAFAFA] px-[14px] py-[11px] text-sm text-[#0A0A0A] outline-none transition-colors focus:border-[#0A0A0A]"
                  >
                    {calendars.map(c => <option key={c.id} value={c.id ?? ''}>{c.name}</option>)}
                  </select>
                </Section>
              </div>

              {/* Color */}
              <div className={cardClass}>
                <Section label="3 · Color de los eventos">
                  <div className="flex flex-wrap gap-2.5">
                    {COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setColorId(c.id)}
                        title={c.name}
                        className={`h-8 w-8 cursor-pointer rounded-full border-[2.5px] transition-transform ${c.swatchClass} ${
                          colorId === c.id
                            ? 'scale-[1.15] border-[#0A0A0A] ring-[2.5px] ring-[#E8E815] ring-offset-1'
                            : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-[#999]">
                    {COLORS.find(c => c.id === colorId)?.name}
                  </p>
                </Section>
              </div>

              {/* Notification */}
              <div className={cardClass}>
                <Section label="4 · Notificación por email">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="mb-1.5 text-xs text-[#999]">¿Cuántos días antes?</p>
                      <Input type="number" min={1} value={notifyDays} onChange={e => setNotifyDays(Number(e.target.value))} />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1.5 text-xs text-[#999]">¿A qué hora? (0–23)</p>
                      <Input type="number" min={0} max={23} value={notifyHour} onChange={e => setNotifyHour(Number(e.target.value))} />
                    </div>
                  </div>
                </Section>
              </div>

              <YellowBtn onClick={handleSubmit} disabled={loading || events.length === 0 || !calendarId}>
                {loading ? 'Creando eventos...' : `Crear ${events.length > 0 ? events.length : ''} eventos →`}
              </YellowBtn>
            </div>
          )}

          {/* ── Success ── */}
          {result && (
            <div className={`${cardClass} flex flex-col items-center gap-5 px-7 py-10 text-center`}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8E815]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading mb-1 text-[22px] font-extrabold tracking-[-0.02em]">
                  {result.length} eventos creados
                </h2>
                <p className="text-sm text-[#888]">Ya aparecen en tu Google Calendar</p>
              </div>
              <div className="max-h-[200px] w-full overflow-y-auto rounded-xl border border-[#EBEBEB]">
                {result.map((e, i) => (
                  <div
                    key={i}
                    className={`flex justify-between px-3 py-[7px] ${i % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'} ${i < result.length - 1 ? 'border-b border-[#F5F5F5]' : ''}`}
                  >
                    <span className="text-xs">{e.summary}</span>
                    <span className="text-xs text-[#999]">{e.date}</span>
                  </div>
                ))}
              </div>
              <OutlineBtn onClick={() => { setResult(null); setEvents([]); if (fileRef.current) fileRef.current.value = ''; }}>
                Cargar otro CSV
              </OutlineBtn>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
