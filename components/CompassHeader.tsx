'use client';

import React from 'react';
import { getCompassStatus } from '@/lib/dateUtils';
import { RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface CompassHeaderProps {
  latestNewsDate?: string;
  totalNewsCount: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const CompassHeader: React.FC<CompassHeaderProps> = ({
  latestNewsDate,
  totalNewsCount,
  onRefresh,
  isRefreshing = false,
}) => {
  const status = getCompassStatus(latestNewsDate);

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

      {/* Ana Masthead (Gazete Başlık Bloğu + Signature Pusula İbresi) */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Sol / Orta: Marka Logosu & Slogan */}
        <div className="text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono tracking-widest uppercase text-brass px-2.5 py-0.5 border border-brass/40 rounded-sm bg-brass/10 font-medium">
              YAPAY ZEKA HABER MERKEZİ
            </span>
            <span className="text-xs font-mono text-steel font-semibold">TR</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-newsreader font-bold tracking-tight text-paper select-none">
            <Link href="/" className="hover:text-brass transition-colors">
              YZ PUSULA
            </Link>
          </h1>

          <p className="mt-1.5 text-sm md:text-base font-inter text-steel/90 max-w-xl font-light">
            Dünyada yapay zeka alanında gerçekleşen yeni modeller, araştırmalar ve lansmanları anlık ve Türkçe olarak takip edin.
          </p>
        </div>

        {/* Sağ: Signature SVG Pusula İbresi & Akıllı Gösterge */}
        <div className="flex items-center gap-4 bg-ink/50 border border-steel/30 rounded-lg p-3.5 sm:p-4 backdrop-blur-sm shadow-inner min-w-[260px] sm:min-w-[280px]">
          {/* SVG Pusula */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center">
            {/* Dış Çerçeve Çemberi */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-brass select-none drop-shadow">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
              <circle cx="50" cy="50" r="42" fill="#151C29" stroke="currentColor" strokeWidth="1.5" />
              
              {/* Yön Harfleri (K, D, G, B) */}
              <text x="50" y="18" fill="#B08D57" fontSize="10" fontWeight="bold" fontFamily="IBM Plex Mono" textAnchor="middle">K</text>
              <text x="85" y="53" fill="#3E5C76" fontSize="8" fontFamily="IBM Plex Mono" textAnchor="middle">D</text>
              <text x="50" y="88" fill="#3E5C76" fontSize="8" fontFamily="IBM Plex Mono" textAnchor="middle">G</text>
              <text x="15" y="53" fill="#3E5C76" fontSize="8" fontFamily="IBM Plex Mono" textAnchor="middle">B</text>

              {/* Pusula İbresi (Rotasyon Animasyonlu) */}
              <g 
                style={{
                  transform: `rotate(${status.rotation}deg)`,
                  transformOrigin: '50px 50px',
                  transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                className={status.isFresh ? 'animate-[pulse_3s_infinite]' : ''}
              >
                {/* Kuzey İbresi (Altın Pirinç) */}
                <polygon points="50,15 45,50 50,44 55,50" fill="#B08D57" />
                <polygon points="50,15 50,44 55,50" fill="#D9BE8F" />
                
                {/* Güney İbresi (Koyu Çelik) */}
                <polygon points="50,85 45,50 50,56 55,50" fill="#3E5C76" opacity="0.8" />

                {/* Orta İğne Göbeği */}
                <circle cx="50" cy="50" r="4" fill="#F6F4EF" stroke="#B08D57" strokeWidth="1.5" />
              </g>
            </svg>
          </div>

          {/* Durum Metinleri */}
          <div className="flex flex-col text-left font-mono">
            <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-sm w-max mb-1 ${
              status.isFresh 
                ? 'bg-brass text-navy font-extrabold' 
                : 'bg-steel/20 text-steel border border-steel/30'
            }`}>
              {status.badge}
            </span>
            <span className="text-xs text-paper font-medium leading-tight">
              {status.label}
            </span>
            <span className="text-[10px] text-steel/80 mt-1">
              Doğru Yön = En Güncel Haber
            </span>
          </div>
        </div>

      </div>

      {/* İnce Pirinç Şerit Ayraç */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-brass to-transparent opacity-60"></div>
    </header>
  );
};
