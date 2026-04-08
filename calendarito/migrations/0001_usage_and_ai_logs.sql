-- Usage, uploads, and AI run tracking.
-- Apply with your preferred Supabase migration workflow.

create table if not exists public.event_generation_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('text', 'file', 'image')),
  model text not null,
  input_text text,
  input_file_name text,
  input_file_mime text,
  input_file_size_bytes bigint,
  output_json jsonb,
  warnings jsonb not null default '[]'::jsonb,
  status text not null check (status in ('success', 'error')),
  error_message text,
  tokens_input integer not null default 0,
  tokens_output integer not null default 0,
  tokens_total integer not null default 0,
  provider_usage_raw jsonb,
  created_at timestamptz not null default now()
);

create index if not exists event_generation_logs_user_id_created_at_idx
  on public.event_generation_logs (user_id, created_at desc);

create table if not exists public.upload_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  upload_type text not null check (upload_type in ('file', 'image')),
  file_name text,
  mime_type text,
  size_bytes bigint,
  source_type text not null default 'inline_base64',
  created_at timestamptz not null default now()
);

create index if not exists upload_logs_user_id_created_at_idx
  on public.upload_logs (user_id, created_at desc);

create table if not exists public.usage_counters (
  user_id uuid primary key references auth.users(id) on delete cascade,
  events_created_count integer not null default 0,
  file_upload_count integer not null default 0,
  image_upload_count integer not null default 0,
  text_requests_count integer not null default 0,
  tokens_input_total bigint not null default 0,
  tokens_output_total bigint not null default 0,
  tokens_total bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.event_generation_logs enable row level security;
alter table public.upload_logs enable row level security;
alter table public.usage_counters enable row level security;

drop policy if exists event_generation_logs_select_own on public.event_generation_logs;
create policy event_generation_logs_select_own
  on public.event_generation_logs for select
  using (auth.uid() = user_id);

drop policy if exists event_generation_logs_insert_own on public.event_generation_logs;
create policy event_generation_logs_insert_own
  on public.event_generation_logs for insert
  with check (auth.uid() = user_id);

drop policy if exists upload_logs_select_own on public.upload_logs;
create policy upload_logs_select_own
  on public.upload_logs for select
  using (auth.uid() = user_id);

drop policy if exists upload_logs_insert_own on public.upload_logs;
create policy upload_logs_insert_own
  on public.upload_logs for insert
  with check (auth.uid() = user_id);

drop policy if exists usage_counters_select_own on public.usage_counters;
create policy usage_counters_select_own
  on public.usage_counters for select
  using (auth.uid() = user_id);

drop policy if exists usage_counters_insert_own on public.usage_counters;
create policy usage_counters_insert_own
  on public.usage_counters for insert
  with check (auth.uid() = user_id);

drop policy if exists usage_counters_update_own on public.usage_counters;
create policy usage_counters_update_own
  on public.usage_counters for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
