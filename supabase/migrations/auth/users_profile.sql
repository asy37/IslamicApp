create table if not exists public.users_profile (
  id uuid primary key references auth.users(id) on delete cascade,

  name text,              -- nullable
  surname text,           -- nullable
  image text,

  is_anonymous boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);