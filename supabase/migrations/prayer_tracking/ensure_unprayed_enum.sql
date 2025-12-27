-- Ensure 'unprayed' exists in prayer_status enum
-- This migration is safe to run multiple times

DO $$
BEGIN
  -- Check if 'unprayed' already exists in enum
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_enum 
    WHERE enumlabel = 'unprayed' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'prayer_status')
  ) THEN
    -- Add 'unprayed' to enum
    -- Note: ALTER TYPE ADD VALUE cannot be used in a transaction block
    -- So we need to drop and recreate
    ALTER TYPE prayer_status RENAME TO prayer_status_old;
    
    CREATE TYPE prayer_status AS ENUM (
      'upcoming',
      'prayed',
      'unprayed',
      'later'
    );
    
    -- Update all columns that use this enum
    ALTER TABLE public.prayer_logs 
      ALTER COLUMN fajr TYPE prayer_status USING fajr::text::prayer_status,
      ALTER COLUMN dhuhr TYPE prayer_status USING dhuhr::text::prayer_status,
      ALTER COLUMN asr TYPE prayer_status USING asr::text::prayer_status,
      ALTER COLUMN maghrib TYPE prayer_status USING maghrib::text::prayer_status,
      ALTER COLUMN isha TYPE prayer_status USING isha::text::prayer_status;
    
    -- Drop old enum
    DROP TYPE prayer_status_old;
  END IF;
END $$;

