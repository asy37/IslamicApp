create trigger trg_prayer_logs_updated_at
before update on public.prayer_logs
for each row
execute function public.set_updated_at();