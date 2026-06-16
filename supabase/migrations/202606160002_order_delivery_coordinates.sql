alter table public.orders
add column if not exists delivery_lat double precision,
add column if not exists delivery_lng double precision,
add column if not exists delivered_at timestamptz;
