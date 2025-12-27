-- Add 'unprayed' to prayer_status enum
-- Note: DROP TYPE CASCADE will drop the table, so we recreate it

-- Step 1: Drop existing enum (this will also drop prayer_logs table due to CASCADE)
DROP TYPE IF EXISTS prayer_status CASCADE;

-- Step 2: Create enum with all values including 'unprayed'
CREATE TYPE prayer_status AS ENUM (
  'upcoming',
  'prayed',
  'unprayed',
  'later'
);

-- Step 3: Recreate prayer_logs table with the new enum
CREATE TABLE public.prayer_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,

  fajr prayer_status NOT NULL DEFAULT 'upcoming',
  dhuhr prayer_status NOT NULL DEFAULT 'upcoming',
  asr prayer_status NOT NULL DEFAULT 'upcoming',
  maghrib prayer_status NOT NULL DEFAULT 'upcoming',
  isha prayer_status NOT NULL DEFAULT 'upcoming',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (user_id, date)
);

