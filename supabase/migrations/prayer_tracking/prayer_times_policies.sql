create policy "Prayer times are readable"
on public.prayer_times
for select
using (true);