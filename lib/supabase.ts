import { createClient } from '@supabase/supabase-js';

export interface Haber {
  id: string;
  baslik: string;
  ozet: string;
  kaynak_url: string;
  kaynak_adi: string;
  yayin_tarihi: string;
  eklenme_tarihi: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
