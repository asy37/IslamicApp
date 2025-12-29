-- Function: Sync prayer log from client
-- Receives boolean payload and upserts to prayer_logs table
-- Used by offline-first sync queue

create or replace function public.sync_prayer_log(
  p_date date,
  p_fajr boolean,
  p_dhuhr boolean,
  p_asr boolean,
  p_maghrib boolean,
  p_isha boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  -- Get current user
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'User must be authenticated';
  end if;

  -- Upsert prayer log
  insert into public.prayer_logs (
    user_id,
    date,
    fajr,
    dhuhr,
    asr,
    maghrib,
    isha
  )
  values (
    v_user_id,
    p_date,
    p_fajr,
    p_dhuhr,
    p_asr,
    p_maghrib,
    p_isha
  )
  on conflict (user_id, date) do update
  set
    fajr = excluded.fajr,
    dhuhr = excluded.dhuhr,
    asr = excluded.asr,
    maghrib = excluded.maghrib,
    isha = excluded.isha,
    updated_at = now();
end;
$$;

