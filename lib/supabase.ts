import { createClient } from '@supabase/supabase-js';

export interface Haber {
  id: string;
  baslik: string;
  ozet: string;
  kaynak_url: string;
  kaynak_adi: string;
  resim_url?: string;
  yayin_tarihi: string;
  eklenme_tarihi: string;
}

export function cleanHeaderString(str?: string): string {
  if (!str) return '';
  return str.replace(/^\uFEFF/, '').replace(/[^\x00-\x7F]/g, '').trim();
}

export function cleanSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const url = cleanHeaderString(rawUrl);
  return url.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
}

// Merkezi Tekil Supabase Ortam Değişkeni Tanımları (NEXT_PUBLIC_ ile tam uyumlu)
export const SUPABASE_URL = cleanSupabaseUrl(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
);

export const SUPABASE_ANON_KEY = cleanHeaderString(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
