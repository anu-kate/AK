-- Antur Kredit (AK) system.
-- Rate: Rp1000 = 1 AK.
-- Run this in Supabase SQL Editor if you cannot use the Supabase CLI.

alter table public.app_settings
add column if not exists driver_service_fee integer not null default 1000;

alter table public.driver_details
add column if not exists antur_credit_balance integer not null default 0;

alter table public.orders
add column if not exists driver_service_fee integer not null default 0,
add column if not exists antur_credit_charged integer not null default 0,
add column if not exists antur_credit_charged_at timestamptz;

create or replace function public.calculate_antur_credit_amount(amount_rupiah numeric)
returns integer
language sql
immutable
as $$
  select greatest(0, ceil(coalesce(amount_rupiah, 0) / 1000.0)::integer);
$$;

grant execute on function public.calculate_antur_credit_amount(numeric) to authenticated;

drop policy if exists "Drivers can read own antur credit" on public.driver_details;
create policy "Drivers can read own antur credit"
on public.driver_details
for select
to authenticated
using (id = auth.uid());

create or replace function public.accept_driver_order_with_credit(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_driver_id uuid := auth.uid();
  v_order record;
  v_balance integer;
  v_driver_service_fee integer;
  v_required_ak integer;
begin
  if v_driver_id is null then
    raise exception 'Pengguna belum login.';
  end if;

  select antur_credit_balance
    into v_balance
  from public.driver_details
  where id = v_driver_id
  for update;

  if not found then
    raise exception 'Data kurir tidak ditemukan.';
  end if;

  if exists (
    select 1
    from public.orders
    where driver_id = v_driver_id
      and status not in ('selesai', 'terkirim', 'dibatalkan')
  ) then
    raise exception 'Selesaikan orderan aktif terlebih dahulu.';
  end if;

  select *
    into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Pesanan tidak ditemukan.';
  end if;

  if v_order.driver_id is not null then
    raise exception 'Pesanan sudah diambil kurir lain.';
  end if;

  if v_order.status not in ('pending', 'diproses', 'siap_diambil') then
    raise exception 'Pesanan sudah tidak tersedia.';
  end if;

  select coalesce(driver_service_fee, 1000)
    into v_driver_service_fee
  from public.app_settings
  where id = 1;

  v_driver_service_fee := coalesce(v_driver_service_fee, 1000);
  v_required_ak := public.calculate_antur_credit_amount(coalesce(v_order.service_fee, 0) + v_driver_service_fee);

  if coalesce(v_balance, 0) < v_required_ak then
    raise exception 'AK tidak mencukupi. Dibutuhkan % AK untuk mengambil pesanan ini.', v_required_ak;
  end if;

  update public.orders
  set driver_id = v_driver_id,
      driver_service_fee = v_driver_service_fee
  where id = p_order_id;

  return jsonb_build_object(
    'ok', true,
    'required_ak', v_required_ak,
    'driver_service_fee', v_driver_service_fee,
    'balance', v_balance
  );
end;
$$;

grant execute on function public.accept_driver_order_with_credit(uuid) to authenticated;

create or replace function public.complete_driver_order_with_credit(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_driver_id uuid := auth.uid();
  v_order record;
  v_balance integer;
  v_driver_service_fee integer;
  v_required_ak integer := 0;
  v_new_balance integer;
begin
  if v_driver_id is null then
    raise exception 'Pengguna belum login.';
  end if;

  select *
    into v_order
  from public.orders
  where id = p_order_id
    and driver_id = v_driver_id
  for update;

  if not found then
    raise exception 'Pesanan aktif tidak ditemukan untuk kurir ini.';
  end if;

  select antur_credit_balance
    into v_balance
  from public.driver_details
  where id = v_driver_id
  for update;

  if not found then
    raise exception 'Data kurir tidak ditemukan.';
  end if;

  v_driver_service_fee := nullif(coalesce(v_order.driver_service_fee, 0), 0);
  if v_driver_service_fee is null then
    select coalesce(driver_service_fee, 1000)
      into v_driver_service_fee
    from public.app_settings
    where id = 1;
  end if;
  v_driver_service_fee := coalesce(v_driver_service_fee, 1000);

  if v_order.antur_credit_charged_at is null then
    v_required_ak := public.calculate_antur_credit_amount(coalesce(v_order.service_fee, 0) + v_driver_service_fee);

    if coalesce(v_balance, 0) < v_required_ak then
      raise exception 'AK tidak mencukupi. Dibutuhkan % AK untuk menyelesaikan pesanan ini.', v_required_ak;
    end if;

    update public.driver_details
    set antur_credit_balance = antur_credit_balance - v_required_ak
    where id = v_driver_id
    returning antur_credit_balance into v_new_balance;
  else
    v_required_ak := coalesce(v_order.antur_credit_charged, 0);
    v_new_balance := v_balance;
  end if;

  update public.orders
  set status = 'terkirim',
      delivered_at = coalesce(delivered_at, now()),
      driver_service_fee = v_driver_service_fee,
      antur_credit_charged = case
        when antur_credit_charged_at is null then v_required_ak
        else antur_credit_charged
      end,
      antur_credit_charged_at = coalesce(antur_credit_charged_at, now())
  where id = p_order_id;

  return jsonb_build_object(
    'ok', true,
    'charged_ak', v_required_ak,
    'balance', v_new_balance,
    'driver_service_fee', v_driver_service_fee
  );
end;
$$;

grant execute on function public.complete_driver_order_with_credit(uuid) to authenticated;
