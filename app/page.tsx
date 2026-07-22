import React from 'react';
import { CompassHeader } from '@/components/CompassHeader';
import { NewsGrid } from '@/components/NewsGrid';
import { EmptyState } from '@/components/EmptyState';
import { Haber, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase';
import { Github } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getNews(): Promise<{ news: Haber[]; isConfigured: boolean }> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { news: [], isConfigured: false };
  }

  try {
    const endpoint = `${SUPABASE_URL}/rest/v1/haberler?select=*&order=yayin_tarihi.desc&limit=50`;
    const res = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Supabase REST HTTP error:', res.status, res.statusText);
      return { news: [], isConfigured: true };
    }

    const data = await res.json();
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

      {/* Gazete Alt Bilgi (Footer) */}
      <footer className="w-full bg-navy text-steel border-t border-steel/30 mt-12 py-8 font-mono text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col text-center md:text-left">
            <span className="text-paper font-newsreader font-bold text-xl tracking-wide">
              YZ PUSULA
            </span>
            <p className="text-steel/80 text-xs mt-1">
              Dünyadaki yapay zeka gelişmelerini anlık ve Türkçe olarak sunan bağımsız haber platformu.
            </p>
          </div>

          <div className="flex items-center gap-4 text-steel/80">
            <a
              href="https://github.com/calderon16/yzpusula"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brass hover:text-brassLight transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-6 pt-4 border-t border-steel/20 text-center text-[11px] text-steel/60">
          © {new Date().getFullYear()} YZ Pusula. Tüm içerikler orijinal kaynakların yayın haklarına tabidir.
        </div>
      </footer>
    </div>
  );
}
