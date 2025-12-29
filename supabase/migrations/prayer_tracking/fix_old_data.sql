-- Fix Old Data in prayer_logs Table
-- This migration cleans up any old enum/string data and ensures all columns are boolean
-- 
-- IMPORTANT: Since we're using offline-first architecture, old Supabase data is not critical.
-- The source of truth is local SQLite, so cleaning old incompatible data is safe.

-- Step 1: Delete all existing data (safest approach)
-- Since we're offline-first, old Supabase data will be re-synced from local SQLite
-- This ensures no type conflicts
truncate table public.prayer_logs;

-- Step 2: Verify all columns are boolean type
do $$
begin
  if exists (
    select 1 
    from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'prayer_logs'
    and column_name in ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')
    and data_type != 'boolean'
  ) then
    raise exception 'prayer_logs table has non-boolean columns. Please run prayer_logs.sql migration first.';
  end if;
end $$;

-- Step 3: Add comment for clarity
comment on table public.prayer_logs is 'Stores synced prayer data in boolean format. Old data has been cleaned.';

