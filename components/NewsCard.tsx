'use client';

import React from 'react';
import Link from 'next/link';
import { Haber } from '@/lib/supabase';
import { getRelativeTimeString, formatFullDate } from '@/lib/dateUtils';
import { ArrowRight, Clock, Newspaper } from 'lucide-react';

interface NewsCardProps {
  haber: Haber;
  isFeatured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ haber, isFeatured = false }) => {
  const relativeTime = getRelativeTimeString(haber.yayin_tarihi);
  const fullDate = formatFullDate(haber.yayin_tarihi);

  // Kaynak adına göre özel badge renkleri
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
    <article
      className={`group relative flex flex-col justify-between bg-paper border border-steel/25 rounded-md p-5 md:p-6 transition-all duration-200 hover:border-brass hover:shadow-card focus-within:ring-2 focus-within:ring-brass focus-within:outline-none ${
        isFeatured ? 'md:col-span-2 md:p-8 bg-gradient-to-br from-paper via-paper to-brassLight/10 border-brass/50' : ''
      }`}
    >
      <div>
        {/* Üst Meta Bilgileri (Kaynak & Yayın Zamanı) */}
        <div className="flex items-center justify-between gap-3 text-xs font-mono mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide border uppercase ${getSourceBadgeStyle(
              haber.kaynak_adi
            )}`}
          >
            <Newspaper className="w-3 h-3 text-brass" />
            {haber.kaynak_adi}
          </span>

          <span
            className="inline-flex items-center gap-1 text-steel font-normal"
            title={fullDate}
          >
            <Clock className="w-3 h-3 text-steel/70" />
            {relativeTime}
          </span>
        </div>

        {/* Haber Başlığı (Newsreader Serif Font) */}
        <h2
          className={`font-newsreader font-bold text-ink leading-snug tracking-normal group-hover:text-brass transition-colors ${
            isFeatured ? 'text-2xl md:text-3xl mb-3' : 'text-xl mb-2.5'
          }`}
        >
          <Link
            href={`/haber/${haber.id}`}
            className="focus:outline-none after:absolute after:inset-0"
          >
            {haber.baslik}
          </Link>
        </h2>

        {/* Haber Özeti (Inter Sans-serif) */}
        <p className="font-inter text-ink/80 text-sm md:text-base leading-relaxed line-clamp-3 mb-4 font-normal">
          {haber.ozet}
        </p>
      </div>

      {/* Alt Aksiyon Çubuğu (Dahili Sayfa Linki & Tarih) */}
      <div className="pt-3 mt-2 border-t border-steel/15 flex items-center justify-between text-xs font-mono text-steel">
        <span className="text-[11px] text-steel/70 hidden sm:inline">
          {fullDate}
        </span>

        <span className="inline-flex items-center gap-1 text-brass font-medium group-hover:underline ml-auto">
          Haberi Oku
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
};
