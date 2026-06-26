import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validasi minimal agar tidak crash jika env belum diisi
const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('YOUR_') && 
  !supabaseAnonKey.includes('YOUR_');

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// ENABLE SUPABASE in V1 to fetch from the newly synced database
export const HAS_SUPABASE = isSupabaseConfigured;
