/**
 * Supabase client configuration
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL and Anon Key are required. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: undefined, // We'll use MMKV for auth storage
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

