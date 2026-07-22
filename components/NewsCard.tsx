'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Haber } from '@/lib/supabase';
import { getRelativeTimeString, formatFullDate } from '@/lib/dateUtils';
import { ArrowRight, Clock, Newspaper } from 'lucide-react';

interface NewsCardProps {
  haber: Haber;
  isFeatured?: boolean;
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80',
];

function getFallbackImage(title: string): string {
  let charSum = 0;
  for (let i = 0; i < title.length; i++) {
    charSum += title.charCodeAt(i);
  }
  return FALLBACK_IMAGES[charSum % FALLBACK_IMAGES.length];
}

export const NewsCard: React.FC<NewsCardProps> = ({ haber, isFeatured = false }) => {
  const relativeTime = getRelativeTimeString(haber.yayin_tarihi);
  const fullDate = formatFullDate(haber.yayin_tarihi);
  const imageUrl = haber.resim_url || getFallbackImage(haber.baslik);

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
      className={`group relative flex flex-col justify-between bg-paper border border-steel/25 rounded-lg overflow-hidden transition-all duration-300 hover:border-brass hover:shadow-card focus-within:ring-2 focus-within:ring-brass focus-within:outline-none ${
        isFeatured ? 'md:col-span-2 bg-gradient-to-br from-paper via-paper to-brassLight/10 border-brass/50' : ''
      }`}
    >
      <div>
        {/* Görsel Katmanı */}
        <div className={`relative w-full overflow-hidden bg-navy/10 ${isFeatured ? 'h-64 sm:h-80' : 'h-48 sm:h-52'}`}>
          <img
            src={imageUrl}
            alt={haber.baslik}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Resim yüklenemezse fallback görsele geç
              (e.target as HTMLImageElement).src = getFallbackImage(haber.baslik);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
          
          {/* Görsel Üzerindeki Kaynak Badge */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold tracking-wide border uppercase backdrop-blur-md shadow-sm ${getSourceBadgeStyle(
                haber.kaynak_adi
              )} bg-paper/90`}
            >
              <Newspaper className="w-3 h-3 text-brass" />
              {haber.kaynak_adi}
            </span>

            <span
              className="inline-flex items-center gap-1 text-[11px] font-mono text-paper bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm"
              title={fullDate}
            >
              <Clock className="w-3 h-3 text-brass" />
              {relativeTime}
            </span>
          </div>
        </div>

        {/* Metin İçeriği */}
        <div className="p-5 md:p-6">
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

          {/* Haber Özeti (Inter Sans-serif - Daha Uzun ve Okunaklı) */}
          <p className="font-inter text-ink/80 text-sm md:text-base leading-relaxed line-clamp-4 mb-4 font-normal">
            {haber.ozet}
          </p>
        </div>
      </div>

      {/* Alt Aksiyon Çubuğu (Dahili Sayfa Linki & Tarih) */}
      <div className="px-5 pb-5 pt-3 border-t border-steel/15 flex items-center justify-between text-xs font-mono text-steel">
        <span className="text-[11px] text-steel/70 hidden sm:inline">
          {fullDate}
        </span>

        <span className="inline-flex items-center gap-1.5 text-brass font-semibold group-hover:underline ml-auto">
          Haberi Oku
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
};
