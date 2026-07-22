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

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://facoyzosjmukbtbqszdq.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY295em9zam11a2J0YnFzemRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MTkwODIsImV4cCI6MjEwMDI5NTA4Mn0.5zqcOEK40vz7rZGmeFZLhAcTRiasQ0GosbUhSCLQ3MM';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
