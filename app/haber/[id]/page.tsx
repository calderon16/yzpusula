import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CompassHeader } from '@/components/CompassHeader';
import { NewsCard } from '@/components/NewsCard';
import { Haber, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase';
import { formatFullDate, getRelativeTimeString } from '@/lib/dateUtils';
import { ArrowLeft, ExternalLink, Clock, Newspaper, Share2, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: {
    id: string;
  };
}

async function getHaberDetail(id: string): Promise<{ haber: Haber | null; relatedNews: Haber[] }> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !id) {
    return { haber: null, relatedNews: [] };
  }

  try {
    // 1. Haberin detayını çek
    const detailEndpoint = `${SUPABASE_URL}/rest/v1/haberler?id=eq.${id}&select=*`;
    const resDetail = await fetch(detailEndpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    });

    if (!resDetail.ok) {
      return { haber: null, relatedNews: [] };
    }

    const detailData = await resDetail.json();
    const haber: Haber | null = detailData && detailData.length > 0 ? detailData[0] : null;

    if (!haber) {
      return { haber: null, relatedNews: [] };
    }

    // 2. Diğer haberleri çek (Öneri Akışı)
    const relatedEndpoint = `${SUPABASE_URL}/rest/v1/haberler?id=neq.${id}&select=*&order=yayin_tarihi.desc&limit=4`;
    const resRelated = await fetch(relatedEndpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    });

    const relatedData = resRelated.ok ? await resRelated.json() : [];

    return { haber, relatedNews: (relatedData as Haber[]) || [] };
  } catch (err) {
    console.error('Haber detay çekme hatası:', err);
    return { haber: null, relatedNews: [] };
  }
}

export default async function HaberDetailPage({ params }: PageProps) {
  const { id } = params;
  const { haber, relatedNews } = await getHaberDetail(id);

  if (!haber) {
    notFound();
  }

  const relativeTime = getRelativeTimeString(haber.yayin_tarihi);
  const fullDate = formatFullDate(haber.yayin_tarihi);

  const getSourceBadgeStyle = (kaynak: string) => {
    switch (kaynak.toLowerCase()) {
      case 'techcrunch ai':
        return 'bg-emerald-950/20 text-emerald-800 border-emerald-700/30';
      case 'the verge ai':
        return 'bg-purple-950/20 text-purple-800 border-purple-700/30';
      case 'venturebeat ai':
        return 'bg-blue-950/20 text-blue-800 border-blue-700/30';
      case 'mit technology review':
        return 'bg-rose-950/20 text-rose-800 border-rose-700/30';
      default:
        return 'bg-navy/10 text-navy border-steel/30';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Üst Masthead ve Pusula */}
      <CompassHeader totalNewsCount={relatedNews.length + 1} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Üst Gezinme & Geri Dönüş Barı */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-steel/20 font-mono text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-steel hover:text-brass transition-colors font-medium group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>← Tüm Haberlere Dön</span>
          </Link>

          <div className="text-steel/70 hidden sm:block">
            Yapay Zeka Haber Pusulası
          </div>
        </div>

        {/* Makale Kartı */}
        <article className="bg-paper border border-steel/30 rounded-lg p-6 sm:p-10 shadow-sm">
          {/* Üst Yayın Rozeti & Zaman */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono mb-6 pb-4 border-b border-steel/15">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold tracking-wide border uppercase ${getSourceBadgeStyle(
                  haber.kaynak_adi
                )}`}
              >
                <Newspaper className="w-3.5 h-3.5 text-brass" />
                {haber.kaynak_adi}
              </span>

              <span className="inline-flex items-center gap-1.5 text-steel" title={fullDate}>
                <Clock className="w-3.5 h-3.5 text-steel/70" />
                {relativeTime}
              </span>
            </div>

            <span className="text-steel/70 text-[11px]">{fullDate}</span>
          </div>

          {/* Manşet Başlık (Serif Font) */}
          <h1 className="font-newsreader font-bold text-3xl sm:text-4xl md:text-5xl text-ink leading-tight tracking-tight mb-6">
            {haber.baslik}
          </h1>

          {/* Türkçe Haber Özeti Bloğu */}
          <div className="bg-paper border-l-4 border-brass pl-5 py-3 my-6 rounded-r">
            <div className="flex items-center gap-1.5 text-xs font-mono text-brass uppercase tracking-wider font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Haber Özeti (Türkçe)</span>
            </div>
            <p className="font-inter text-ink/90 text-base sm:text-lg leading-relaxed font-normal">
              {haber.ozet}
            </p>
          </div>

          {/* Orijinal Haberi Kaynağında Oku Butonu */}
          <div className="mt-8 pt-6 border-t border-steel/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <a
              href={haber.kaynak_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-navy text-paper font-mono text-sm font-semibold rounded-md border border-brass/50 hover:bg-brass hover:text-navy transition-all duration-200 shadow-md group"
            >
              <span>Orijinal Makaleyi Kaynağında Oku ({haber.kaynak_adi})</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <div className="text-center sm:text-right text-xs font-mono text-steel">
              Kaynak: <span className="text-ink font-medium">{haber.kaynak_adi}</span>
            </div>
          </div>
        </article>

        {/* Diğer Güncel Haberler (Öneri Akışı) */}
        {relatedNews.length > 0 && (
          <section className="mt-14 pt-8 border-t border-steel/30">
            <h3 className="font-newsreader font-bold text-2xl text-ink mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brass"></span>
              Diğer Güncel Yapay Zeka Haberleri
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedNews.map((relItem) => (
                <NewsCard key={relItem.id} haber={relItem} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Alt Bilgi */}
      <footer className="w-full bg-navy text-steel border-t border-steel/30 mt-16 py-8 font-mono text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col text-center md:text-left">
            <span className="text-paper font-newsreader font-bold text-xl tracking-wide">
              YZ PUSULA
            </span>
            <p className="text-steel/80 text-xs mt-1">
              Dünyadaki yapay zeka gelişmelerini anlık ve Türkçe olarak sunan bağımsız haber platformu.
            </p>
          </div>
          <Link href="/" className="text-brass hover:underline">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </footer>
    </div>
  );
}
