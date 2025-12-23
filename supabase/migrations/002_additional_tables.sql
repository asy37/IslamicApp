-- Additional tables for MVP features
-- Run this after 001_initial_schema.sql

-- ============================================
-- 1. Prayer Times Cache
-- ============================================
CREATE TABLE IF NOT EXISTS public.prayer_times_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  location_city TEXT,
  location_country TEXT,
  prayer_method TEXT NOT NULL CHECK (prayer_method IN ('diyanet', 'mwl', 'umm_al_qura')),
  fajr_time TIME NOT NULL,
  dhuhr_time TIME NOT NULL,
  asr_time TIME NOT NULL,
  maghrib_time TIME NOT NULL,
  isha_time TIME NOT NULL,
  hijri_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, location_lat, location_lng, prayer_method)
);

CREATE INDEX idx_prayer_times_cache_date_location 
ON public.prayer_times_cache(date, location_lat, location_lng);

-- RLS Policies
ALTER TABLE public.prayer_times_cache ENABLE ROW LEVEL SECURITY;

-- Cache is public readable (no user-specific data)
CREATE POLICY "Anyone can read prayer times cache"
  ON public.prayer_times_cache FOR SELECT
  USING (true);

-- ============================================
-- 2. Dhikr Presets
-- ============================================
CREATE TABLE IF NOT EXISTS public.dhikr_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  arabic TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  target INTEGER NOT NULL DEFAULT 33,
  description TEXT,
  is_system BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX idx_dhikr_presets_user ON public.dhikr_presets(user_id);
CREATE INDEX idx_dhikr_presets_system ON public.dhikr_presets(is_system) WHERE is_system = true;

-- RLS Policies
ALTER TABLE public.dhikr_presets ENABLE ROW LEVEL SECURITY;

-- System presets are public readable
CREATE POLICY "Anyone can read system dhikr presets"
  ON public.dhikr_presets FOR SELECT
  USING (is_system = true OR auth.uid() = user_id);

-- Users can insert their own presets
CREATE POLICY "Users can insert own dhikr presets"
  ON public.dhikr_presets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own presets
CREATE POLICY "Users can update own dhikr presets"
  ON public.dhikr_presets FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete own presets
CREATE POLICY "Users can delete own dhikr presets"
  ON public.dhikr_presets FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 3. Dhikr Sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.dhikr_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dhikr_preset_id UUID REFERENCES public.dhikr_presets(id) ON DELETE SET NULL,
  dhikr_name TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  target INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dhikr_sessions_user_date 
ON public.dhikr_sessions(user_id, date DESC);
CREATE INDEX idx_dhikr_sessions_user_completed 
ON public.dhikr_sessions(user_id, completed);

-- RLS Policies
ALTER TABLE public.dhikr_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dhikr sessions"
  ON public.dhikr_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dhikr sessions"
  ON public.dhikr_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dhikr sessions"
  ON public.dhikr_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dhikr sessions"
  ON public.dhikr_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. Quran Surahs
-- ============================================
CREATE TABLE IF NOT EXISTS public.quran_surahs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER UNIQUE NOT NULL CHECK (number >= 1 AND number <= 114),
  name TEXT NOT NULL,
  arabic_name TEXT NOT NULL,
  english_name TEXT NOT NULL,
  ayah_count INTEGER NOT NULL,
  revelation_type TEXT NOT NULL CHECK (revelation_type IN ('meccan', 'medinan')),
  revelation_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quran_surahs_number ON public.quran_surahs(number);

-- RLS Policies
ALTER TABLE public.quran_surahs ENABLE ROW LEVEL SECURITY;

-- Quran data is public readable
CREATE POLICY "Anyone can read quran surahs"
  ON public.quran_surahs FOR SELECT
  USING (true);

-- ============================================
-- 5. Quran Ayahs
-- ============================================
CREATE TABLE IF NOT EXISTS public.quran_ayahs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  surah_number INTEGER NOT NULL REFERENCES public.quran_surahs(number) ON DELETE CASCADE,
  ayah_number INTEGER NOT NULL CHECK (ayah_number >= 1),
  text TEXT NOT NULL,
  juz_number INTEGER,
  page_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(surah_number, ayah_number)
);

CREATE INDEX idx_quran_ayahs_surah ON public.quran_ayahs(surah_number, ayah_number);
CREATE INDEX idx_quran_ayahs_juz ON public.quran_ayahs(juz_number);
CREATE INDEX idx_quran_ayahs_page ON public.quran_ayahs(page_number);

-- RLS Policies
ALTER TABLE public.quran_ayahs ENABLE ROW LEVEL SECURITY;

-- Quran data is public readable
CREATE POLICY "Anyone can read quran ayahs"
  ON public.quran_ayahs FOR SELECT
  USING (true);

-- ============================================
-- 6. Quran Translations
-- ============================================
CREATE TABLE IF NOT EXISTS public.quran_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER NOT NULL,
  translation_id TEXT NOT NULL,
  translation_text TEXT NOT NULL,
  translator_name TEXT,
  language TEXT DEFAULT 'tr',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (surah_number, ayah_number) 
    REFERENCES public.quran_ayahs(surah_number, ayah_number) 
    ON DELETE CASCADE,
  UNIQUE(surah_number, ayah_number, translation_id)
);

CREATE INDEX idx_quran_translations_surah_ayah 
ON public.quran_translations(surah_number, ayah_number);
CREATE INDEX idx_quran_translations_id ON public.quran_translations(translation_id);

-- RLS Policies
ALTER TABLE public.quran_translations ENABLE ROW LEVEL SECURITY;

-- Translations are public readable
CREATE POLICY "Anyone can read quran translations"
  ON public.quran_translations FOR SELECT
  USING (true);

-- ============================================
-- 7. Daily Verses
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_verses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  translation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (surah_number, ayah_number) 
    REFERENCES public.quran_ayahs(surah_number, ayah_number)
);

CREATE INDEX idx_daily_verses_date ON public.daily_verses(date DESC);

-- RLS Policies
ALTER TABLE public.daily_verses ENABLE ROW LEVEL SECURITY;

-- Daily verses are public readable
CREATE POLICY "Anyone can read daily verses"
  ON public.daily_verses FOR SELECT
  USING (true);

-- ============================================
-- Seed Data: System Dhikr Presets
-- ============================================
INSERT INTO public.dhikr_presets (name, arabic, transliteration, target, description, is_system, user_id) VALUES
('Subhanallah', 'سُبْحَانَ اللَّهِ', 'Subhanallah', 33, 'Allah''ı tesbih etmek', true, NULL),
('Alhamdulillah', 'الْحَمْدُ لِلَّهِ', 'Alhamdulillah', 33, 'Allah''a hamd etmek', true, NULL),
('Allahu Akbar', 'اللَّهُ أَكْبَرُ', 'Allahu Akbar', 34, 'Allah''ı tekbir etmek', true, NULL)
ON CONFLICT DO NOTHING;

