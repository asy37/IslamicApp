-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prayer logs table
CREATE TABLE IF NOT EXISTS public.prayer_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  prayer_name TEXT NOT NULL CHECK (prayer_name IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')),
  status TEXT NOT NULL CHECK (status IN ('completed', 'missed', 'pending')),
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, prayer_name)
);

-- Push tokens table
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- User settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prayer_method TEXT DEFAULT 'diyanet' CHECK (prayer_method IN ('diyanet', 'mwl', 'umm_al_qura')),
  notification_settings JSONB DEFAULT '{}'::jsonb,
  location JSONB,
  daily_verse_enabled BOOLEAN DEFAULT false,
  daily_verse_time TEXT, -- HH:mm format
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prayer_logs_user_date ON public.prayer_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_prayer_logs_user_prayer ON public.prayer_logs(user_id, prayer_name);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON public.push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_token ON public.push_tokens(token);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Prayer logs policies
CREATE POLICY "Users can view own prayer logs"
  ON public.prayer_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prayer logs"
  ON public.prayer_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prayer logs"
  ON public.prayer_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prayer logs"
  ON public.prayer_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Push tokens policies
CREATE POLICY "Users can view own push tokens"
  ON public.push_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own push tokens"
  ON public.push_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own push tokens"
  ON public.push_tokens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own push tokens"
  ON public.push_tokens FOR DELETE
  USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_push_tokens
  BEFORE UPDATE ON public.push_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_user_settings
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

