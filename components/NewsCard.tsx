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

const DIVERSE_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1614680376593-902f749f7b6c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?auto=format&fit=crop&w=1200&q=80',
];

function getFallbackImage(title: string, id?: string): string {
  let charSum = 0;
  const seed = (title || '') + (id || '');
  for (let i = 0; i < seed.length; i++) {
    charSum += seed.charCodeAt(i);
  }
  return DIVERSE_FALLBACK_IMAGES[charSum % DIVERSE_FALLBACK_IMAGES.length];
}

export const NewsCard: React.FC<NewsCardProps> = ({ haber, isFeatured = false }) => {
  const relativeTime = getRelativeTimeString(haber.yayin_tarihi);
  const fullDate = formatFullDate(haber.yayin_tarihi);
  const imageUrl = haber.resim_url || getFallbackImage(haber.baslik, haber.id);

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
              (e.target as HTMLImageElement).src = getFallbackImage(haber.baslik, haber.id);
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
          {/* Haber Başlığı */}
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

          {/* Haber Özeti */}
          <p className="font-inter text-ink/80 text-sm md:text-base leading-relaxed line-clamp-4 mb-4 font-normal">
            {haber.ozet}
          </p>
        </div>
      </div>

      {/* Alt Aksiyon Çubuğu */}
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
