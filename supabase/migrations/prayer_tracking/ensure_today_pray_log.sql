create or replace function public.ensure_today_prayer_log()
returns void
language plpgsql
as $$
begin
  insert into public.prayer_logs (user_id, date)
  values (auth.uid(), current_date)
  on conflict (user_id, date) do nothing;
end;
$$;