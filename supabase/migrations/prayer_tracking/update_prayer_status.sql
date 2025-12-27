-- Function: Update prayer status for today
-- prayer_name: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'
-- status: 'prayed' | 'unprayed' | 'later' | 'upcoming'

create or replace function public.update_prayer_status(
  p_prayer_name text,
  p_status prayer_status
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_today date;
begin
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  v_today := current_date;

  -- Validate prayer name
  IF p_prayer_name NOT IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha') THEN
    RAISE EXCEPTION 'Invalid prayer name: %', p_prayer_name;
  END IF;

  -- Ensure today's log exists
  INSERT INTO public.prayer_logs (user_id, date)
  VALUES (v_user_id, v_today)
  ON CONFLICT (user_id, date) DO NOTHING;

  -- Update the specific prayer column using CASE statement
  -- This avoids dynamic SQL and ensures FOUND works correctly
  UPDATE public.prayer_logs
  SET 
    fajr = CASE WHEN p_prayer_name = 'fajr' THEN p_status ELSE fajr END,
    dhuhr = CASE WHEN p_prayer_name = 'dhuhr' THEN p_status ELSE dhuhr END,
    asr = CASE WHEN p_prayer_name = 'asr' THEN p_status ELSE asr END,
    maghrib = CASE WHEN p_prayer_name = 'maghrib' THEN p_status ELSE maghrib END,
    isha = CASE WHEN p_prayer_name = 'isha' THEN p_status ELSE isha END,
    updated_at = now()
  WHERE user_id = v_user_id AND date = v_today;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Prayer log not found for user and date';
  END IF;
END;
$$;

