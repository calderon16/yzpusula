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

export function cleanHeaderString(str?: string): string {
  if (!str) return '';
  // Unicode BOM (\uFEFF) ve görünmeyen non-ASCII karakterleri temizle
  return str.replace(/^\uFEFF/, '').replace(/[^\x00-\x7F]/g, '').trim();
}

export function cleanSupabaseUrl(rawUrl?: string): string {
  const defaultUrl = 'https://facoyzosjmukbtbqszdq.supabase.co';
  const url = cleanHeaderString(rawUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || defaultUrl);
  return url.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
}

export const SUPABASE_URL = cleanSupabaseUrl();

export const SUPABASE_ANON_KEY = cleanHeaderString(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY295em9zam11a2J0YnFzemRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MTkwODIsImV4cCI6MjEwMDI5NTA4Mn0.5zqcOEK40vz7rZGmeFZLhAcTRiasQ0GosbUhSCLQ3MM'
);

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
