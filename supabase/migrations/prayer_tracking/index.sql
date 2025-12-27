create index idx_prayer_logs_user_date
on public.prayer_logs (user_id, date desc);