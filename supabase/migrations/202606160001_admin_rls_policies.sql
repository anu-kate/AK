-- Admin access policies for Anturun.
-- Run this in Supabase SQL Editor if you cannot use the Supabase CLI.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

alter table public.orders enable row level security;
alter table public.profiles enable row level security;
alter table public.merchant_details enable row level security;
alter table public.driver_details enable row level security;

grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.merchant_details to authenticated;
grant select, insert, update on public.driver_details to authenticated;

drop policy if exists "Admins can read all orders" on public.orders;
create policy "Admins can read all orders"
on public.orders
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update all orders" on public.orders;
create policy "Admins can update all orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update all profiles" on public.profiles;
create policy "Admins can update all profiles"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read all merchant details" on public.merchant_details;
create policy "Admins can read all merchant details"
on public.merchant_details
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update all merchant details" on public.merchant_details;
create policy "Admins can update all merchant details"
on public.merchant_details
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read all driver details" on public.driver_details;
create policy "Admins can read all driver details"
on public.driver_details
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update all driver details" on public.driver_details;
create policy "Admins can update all driver details"
on public.driver_details
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
