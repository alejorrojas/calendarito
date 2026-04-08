import type { createSupabaseServerClient } from '@/lib/supabase-server';

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

interface UsageDelta {
  eventsCreated?: number;
  fileUploads?: number;
  imageUploads?: number;
  textRequests?: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

interface AiRunPayload {
  userId: string;
  sourceType: 'text' | 'file' | 'image';
  model: string;
  inputText?: string | null;
  inputFileName?: string | null;
  inputFileMime?: string | null;
  inputFileSizeBytes?: number | null;
  outputJson?: unknown;
  warnings?: string[];
  status: 'success' | 'error';
  errorMessage?: string | null;
  providerUsageRaw?: unknown;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

interface UploadLogPayload {
  userId: string;
  uploadType: 'file' | 'image';
  fileName?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
}

export function normalizeTokenUsage(usage: unknown): { inputTokens: number; outputTokens: number; totalTokens: number } {
  if (!usage || typeof usage !== 'object') {
    return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
  }

  const record = usage as Record<string, unknown>;
  const inputTokens = toNumber(record.inputTokens) ?? toNumber(record.promptTokens) ?? 0;
  const outputTokens = toNumber(record.outputTokens) ?? toNumber(record.completionTokens) ?? 0;
  const totalTokens = toNumber(record.totalTokens) ?? inputTokens + outputTokens;

  return { inputTokens, outputTokens, totalTokens };
}

export async function logEventGeneration(supabase: SupabaseServerClient, payload: AiRunPayload) {
  const { error } = await supabase.from('event_generation_logs').insert({
    user_id: payload.userId,
    source_type: payload.sourceType,
    model: payload.model,
    input_text: payload.inputText ?? null,
    input_file_name: payload.inputFileName ?? null,
    input_file_mime: payload.inputFileMime ?? null,
    input_file_size_bytes: payload.inputFileSizeBytes ?? null,
    output_json: payload.outputJson ?? null,
    warnings: payload.warnings ?? [],
    status: payload.status,
    error_message: payload.errorMessage ?? null,
    tokens_input: payload.inputTokens ?? 0,
    tokens_output: payload.outputTokens ?? 0,
    tokens_total: payload.totalTokens ?? 0,
    provider_usage_raw: payload.providerUsageRaw ?? null,
  });

  if (error) throw error;
}

export async function logUpload(supabase: SupabaseServerClient, payload: UploadLogPayload) {
  const { error } = await supabase.from('upload_logs').insert({
    user_id: payload.userId,
    upload_type: payload.uploadType,
    file_name: payload.fileName ?? null,
    mime_type: payload.mimeType ?? null,
    size_bytes: payload.sizeBytes ?? null,
  });

  if (error) throw error;
}

export async function incrementUsageCounters(supabase: SupabaseServerClient, userId: string, delta: UsageDelta) {
  const { data: existing, error: selectError } = await supabase
    .from('usage_counters')
    .select(
      'events_created_count,file_upload_count,image_upload_count,text_requests_count,tokens_input_total,tokens_output_total,tokens_total'
    )
    .eq('user_id', userId)
    .maybeSingle();

  if (selectError) throw selectError;

  const next = {
    user_id: userId,
    events_created_count: (existing?.events_created_count ?? 0) + (delta.eventsCreated ?? 0),
    file_upload_count: (existing?.file_upload_count ?? 0) + (delta.fileUploads ?? 0),
    image_upload_count: (existing?.image_upload_count ?? 0) + (delta.imageUploads ?? 0),
    text_requests_count: (existing?.text_requests_count ?? 0) + (delta.textRequests ?? 0),
    tokens_input_total: (existing?.tokens_input_total ?? 0) + (delta.inputTokens ?? 0),
    tokens_output_total: (existing?.tokens_output_total ?? 0) + (delta.outputTokens ?? 0),
    tokens_total: (existing?.tokens_total ?? 0) + (delta.totalTokens ?? 0),
    updated_at: new Date().toISOString(),
  };

  const { error: upsertError } = await supabase.from('usage_counters').upsert(next, { onConflict: 'user_id' });
  if (upsertError) throw upsertError;
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}
