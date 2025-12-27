-- Function: Get today's prayer log, create if missing
-- Returns prayer statuses and calculated progress

create or replace function public.get_today_prayer_log()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_today date;
  v_log_record public.prayer_logs%rowtype;
  v_result jsonb;
  v_prayed_count int := 0;
  v_total_count int := 5;
begin
  -- Get current user
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'User must be authenticated';
  end if;

  v_today := current_date;

  -- Ensure today's log exists
  insert into public.prayer_logs (user_id, date)
  values (v_user_id, v_today)
  on conflict (user_id, date) do nothing;

  -- Get the log record
  select * into v_log_record
  from public.prayer_logs
  where user_id = v_user_id and date = v_today;

  -- Count prayed prayers
  if v_log_record.fajr = 'prayed' then v_prayed_count := v_prayed_count + 1; end if;
  if v_log_record.dhuhr = 'prayed' then v_prayed_count := v_prayed_count + 1; end if;
  if v_log_record.asr = 'prayed' then v_prayed_count := v_prayed_count + 1; end if;
  if v_log_record.maghrib = 'prayed' then v_prayed_count := v_prayed_count + 1; end if;
  if v_log_record.isha = 'prayed' then v_prayed_count := v_prayed_count + 1; end if;

  -- Build result JSON
  v_result := jsonb_build_object(
    'prayers', jsonb_build_object(
      'fajr', v_log_record.fajr,
      'dhuhr', v_log_record.dhuhr,
      'asr', v_log_record.asr,
      'maghrib', v_log_record.maghrib,
      'isha', v_log_record.isha
    ),
    'percent', round((v_prayed_count::numeric / v_total_count::numeric) * 100)
  );

  return v_result;
end;
$$;

