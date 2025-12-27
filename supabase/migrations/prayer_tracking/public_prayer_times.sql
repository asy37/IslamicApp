create table public.prayer_times (
  id uuid primary key default gen_random_uuid(),
  date date not null,

  fajr time not null,
  dhuhr time not null,
  asr time not null,
  maghrib time not null,
  isha time not null,

  latitude numeric(9,6),
  longitude numeric(9,6),
  timezone text not null,

  created_at timestamptz not null default now(),

  unique (date, latitude, longitude)
);