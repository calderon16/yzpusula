import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { CompassHeader } from '@/components/CompassHeader';
import { NewsGrid } from '@/components/NewsGrid';
import { EmptyState } from '@/components/EmptyState';
import { Haber } from '@/lib/supabase';
import { Github } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getNews(): Promise<{ news: Haber[]; isConfigured: boolean }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return { news: [], isConfigured: false };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('haberler')
      .select('*')
      .order('yayin_tarihi', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase fetch error:', error.message);
      return { news: [], isConfigured: true };
    }

    return { news: (data as Haber[]) || [], isConfigured: true };
  } catch (err) {
    console.error('Unexpected error fetching news:', err);
    return { news: [], isConfigured: true };
  }
}

export default async function HomePage() {
  const { news, isConfigured } = await getNews();
  const latestNewsDate = news.length > 0 ? news[0].yayin_tarihi : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Üst Masthead ve Pusula İbresi */}
      <CompassHeader
        latestNewsDate={latestNewsDate}
        totalNewsCount={news.length}
      />

      {/* Ana İçerik Alanı */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {news.length === 0 ? (
          <EmptyState isConfigured={isConfigured} />
        ) : (
          <NewsGrid newsList={news} />
        )}
      </main>

      {/* Gazeteci/Ajans Alt Bilgi (Footer) */}
      <footer className="w-full bg-navy text-steel border-t border-steel/30 mt-12 py-8 font-mono text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col text-center md:text-left">
            <span className="text-paper font-newsreader font-bold text-lg tracking-wide">
              YZ PUSULA
            </span>
            <p className="text-steel/80 text-[11px] mt-0.5">
              Bağımsız, Otomatik ve 0 TL Maliyetli Yapay Zeka Haber Platformu.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-steel/90 text-[11px]">
            <span className="hover:text-brass transition-colors">
              Frontend: Next.js 14 (App Router SSR)
            </span>
            <span>•</span>
            <span className="hover:text-brass transition-colors">
              DB: Supabase PostgreSQL
            </span>
            <span>•</span>
            <span className="hover:text-brass transition-colors">
              Cron: GitHub Actions
            </span>
            <span>•</span>
            <span className="hover:text-brass transition-colors">
              Hosting: Vercel Free
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/calderon16/yzpusula"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brass hover:text-brassLight transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repo</span>
            </a>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-4 mt-6 pt-4 border-t border-steel/20 text-center text-[10px] text-steel/60">
          © {new Date().getFullYear()} YZ Pusula. Haber içerikleri orijinal kaynakların mülkiyetindedir.
        </div>
      </footer>
    </div>
  );
}
