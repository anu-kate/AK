-- Driver FCM tokens for hybrid Supabase + Firebase notifications.

create table if not exists public.driver_push_tokens (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles(id) on delete cascade,
  fcm_token text not null unique,
  platform text not null default 'web',
  user_agent text,
  is_active boolean not null default true,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists driver_push_tokens_driver_id_idx on public.driver_push_tokens(driver_id);
create index if not exists driver_push_tokens_active_idx on public.driver_push_tokens(is_active);

alter table public.driver_push_tokens enable row level security;

grant select, insert, update, delete on public.driver_push_tokens to authenticated;

drop policy if exists "Drivers can manage own push tokens" on public.driver_push_tokens;
create policy "Drivers can manage own push tokens"
on public.driver_push_tokens
for all
to authenticated
using (driver_id = auth.uid())
with check (driver_id = auth.uid());

drop policy if exists "Admins can read push tokens" on public.driver_push_tokens;
create policy "Admins can read push tokens"
on public.driver_push_tokens
for select
to authenticated
using (public.is_admin());
