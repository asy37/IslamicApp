create table public.prayer_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,

  fajr prayer_status not null default 'upcoming',
  dhuhr prayer_status not null default 'upcoming',
  asr prayer_status not null default 'upcoming',
  maghrib prayer_status not null default 'upcoming',
  isha prayer_status not null default 'upcoming',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, date)
);