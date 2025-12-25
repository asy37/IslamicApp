create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users_profile (
    id,
    name,
    surname,
    image,
    is_anonymous
  )
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'surname',
    new.raw_user_meta_data->>'image',
    coalesce(new.is_anonymous, true)
  );

  return new;
end;
$$;