'use client';

import React from 'react';
import { Compass, Terminal, ShieldAlert } from 'lucide-react';

interface EmptyStateProps {
  isConfigured?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isConfigured = true }) => {
  return (
    <div className="w-full bg-paper border border-dashed border-steel/40 rounded-lg p-8 md:p-12 text-center my-8 shadow-sm">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/5 text-brass mb-4 border border-brass/30">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>

      <h3 className="font-newsreader font-bold text-2xl text-ink mb-2">
        {isConfigured ? 'Henüz Yayınlanmış Haber Bulunmuyor' : 'Supabase Bağlantı Kurulumu Bekleniyor'}
      </h3>

      <p className="font-inter text-steel text-sm md:text-base max-w-md mx-auto mb-6">
        {isConfigured
          ? 'Pusula RSS tarama mekanizması henüz veritabanına ilk haberleri yazmadı. Otomatik tarama günde 3 kez (08:00, 14:00, 20:00) gerçekleşir.'
          : 'Frontend veritabanına bağlanmak için .env.local dosyanızdaki Supabase URL ve Anon Key tanımlarını tamamlamanız gerekmektedir.'}
      </p>

      {isConfigured ? (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-paper font-mono text-xs rounded border border-brass/40 shadow">
          <Terminal className="w-4 h-4 text-brass" />
          <span>İlk haberleri çekmek için terminalde: <strong>node scripts/fetch-news.mjs</strong> çalıştırın.</span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-900 font-mono text-xs rounded border border-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Lütfen .env.example dosyasındaki değişkenleri .env.local dosyasına kopyalayın.</span>
        </div>
      )}
    </div>
  );
};
