-- Function: Calculate prayer streak (consecutive days with ALL prayers prayed)
-- Returns the count of consecutive days ending today where all 5 prayers were prayed
-- Uses boolean format (true = prayed)

create or replace function public.get_prayer_streak()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_streak int := 0;
  v_check_date date := current_date;
  v_log_record public.prayer_logs%rowtype;
  v_all_prayed boolean;
begin
  -- Get current user
  v_user_id := auth.uid();
  if v_user_id is null then
    return 0;
  end if;

  -- Check backwards from today
  loop
    -- Safety: don't go back more than a year
    if v_check_date < current_date - interval '365 days' then
      exit;
    end if;

    -- Get log for this date
    -- Wrap entire logic in exception handler to catch type errors
    begin
      select * into strict v_log_record
      from public.prayer_logs
      where user_id = v_user_id and date = v_check_date;

      -- Check if all 5 prayers were prayed (all booleans must be true)
      -- If any column is not boolean, this will raise an error
      v_all_prayed := (
        v_log_record.fajr = true and
        v_log_record.dhuhr = true and
        v_log_record.asr = true and
        v_log_record.maghrib = true and
        v_log_record.isha = true
      );

      -- If not all prayed, stop counting
      exit when not v_all_prayed;

      -- Increment streak and go to previous day
      v_streak := v_streak + 1;
      v_check_date := v_check_date - interval '1 day';

    exception
      when no_data_found then
        -- No record for this date, stop counting
        exit;
      when others then
        -- Type mismatch or other error - skip this date
        raise notice 'Skipping date % due to error (likely non-boolean data): %', v_check_date, sqlerrm;
        v_check_date := v_check_date - interval '1 day';
        -- Loop will continue with next date
    end;
  end loop;

  return v_streak;
end;
$$;

