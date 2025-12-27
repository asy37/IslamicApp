create policy "Users can manage own prayer logs"
on public.prayer_logs
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());