alter table public.driver_push_tokens
add column if not exists notification_sound text not null default 'default',
add column if not exists notification_channel_id text not null default 'driver_orders_default';

create index if not exists driver_push_tokens_platform_idx on public.driver_push_tokens(platform);
