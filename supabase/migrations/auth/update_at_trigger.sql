create trigger set_users_profile_updated_at
before update on public.users_profile
for each row
execute function public.set_updated_at();