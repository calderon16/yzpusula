'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface CompassHeaderProps {
  latestNewsDate?: string;
  totalNewsCount: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const CompassHeader: React.FC<CompassHeaderProps> = ({
  totalNewsCount,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <header className="w-full bg-navy text-paper border-b border-steel/30 shadow-md">
      {/* Üst İnce Bilgi Çubuğu */}
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between text-xs font-mono text-steel border-b border-steel/20">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-brass font-medium">
            <span className="w-2 h-2 rounded-full bg-brass animate-pulse"></span>
            CANLI HABER AKIŞI
          </span>
          <span className="hidden sm:inline text-steel/60">|</span>
          <span className="hidden sm:inline text-steel/80 tracking-wide">
            TÜRKİYE'NİN BAĞIMSIZ YAPAY ZEKA HABER PUSULASI
          </span>
        </div>
        <div className="flex items-center gap-4">
          {totalNewsCount > 0 && (
            <span>
              Toplam Haber: <strong className="text-paper font-semibold">{totalNewsCount}</strong>
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 hover:text-brass transition-colors focus:outline-none focus:ring-1 focus:ring-brass rounded px-2 py-0.5"
              title="Sayfayı Yenile"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brass' : ''}`} />
              <span className="hidden xs:inline">Yenile</span>
            </button>
          )}
        </div>
      </div>

      {/* Ana Masthead (Sade Editoryal Başlık Bloğu) */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="text-xs font-mono tracking-widest uppercase text-brass px-3 py-1 border border-brass/40 rounded-sm bg-brass/10 font-medium">
            YAPAY ZEKA HABER MERKEZİ
          </span>
          <span className="text-xs font-mono text-steel font-semibold">TR</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-newsreader font-bold tracking-tight text-paper select-none">
          <Link href="/" className="hover:text-brass transition-colors">
            YZ PUSULA
          </Link>
        </h1>

        <p className="mt-2 text-sm md:text-base font-inter text-steel/90 max-w-2xl font-light leading-relaxed">
          Dünyada yapay zeka alanında gerçekleşen yeni modeller, araştırmalar ve lansmanları anlık ve Türkçe olarak takip edin.
        </p>
      </div>

      {/* İnce Pirinç Şerit Ayraç */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-brass to-transparent opacity-60"></div>
    </header>
  );
};
