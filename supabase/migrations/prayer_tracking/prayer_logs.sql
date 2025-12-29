-- Prayer Logs Sync Table (Supabase)
-- This table stores ONLY synced prayer data (boolean format)
-- Used for streak calculation and historical data
-- NOT used for daily UI state (that's in SQLite)

create table public.prayer_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,

  -- Boolean format: true = prayed, false = not prayed
  fajr boolean not null default false,
  dhuhr boolean not null default false,
  asr boolean not null default false,
  maghrib boolean not null default false,
  isha boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, date)
);