'use client';

import React, { useState, useMemo } from 'react';
import { Haber } from '@/lib/supabase';
import { NewsCard } from './NewsCard';
import { Filter, Search, LayoutGrid, List } from 'lucide-react';

interface NewsGridProps {
  newsList: Haber[];
}

export const NewsGrid: React.FC<NewsGridProps> = ({ newsList }) => {
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

  // Benzersiz kaynak listesi
  const sources = useMemo(() => {
    const set = new Set<string>();
    newsList.forEach((n) => set.add(n.kaynak_adi));
    return Array.from(set);
  }, [newsList]);

  // Filtreleme mantığı
  const filteredNews = useMemo(() => {
    return newsList.filter((haber) => {
      const matchesSource =
        selectedSource === 'all' || haber.kaynak_adi === selectedSource;
      const matchesSearch =
        searchQuery === '' ||
        haber.baslik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        haber.ozet.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSource && matchesSearch;
    });
  }, [newsList, selectedSource, searchQuery]);

  return (
    <div className="w-full">
      {/* Filtre ve Arama Araç Çubuğu */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-steel/20 font-mono text-xs">
        
        {/* Sol: Kaynak Filtre Butonları */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <span className="text-steel/70 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-brass" />
            Kaynak:
          </span>
          <button
            onClick={() => setSelectedSource('all')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              selectedSource === 'all'
                ? 'bg-navy text-paper font-semibold border border-brass/50'
                : 'bg-paper text-ink border border-steel/30 hover:bg-steel/10'
            }`}
          >
            Tümü ({newsList.length})
          </button>

          {sources.map((source) => {
            const count = newsList.filter((n) => n.kaynak_adi === source).length;
            return (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                  selectedSource === source
                    ? 'bg-navy text-paper font-semibold border border-brass/50'
                    : 'bg-paper text-ink border border-steel/30 hover:bg-steel/10'
                }`}
              >
                {source} ({count})
              </button>
            );
          })}
        </div>

        {/* Sağ: Arama Girdisi & Düzen Seçimi */}
        <div className="flex items-center gap-2">
          {/* Arama Kutusu */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-steel/60" />
            <input
              type="text"
              placeholder="Haber başlığı veya anahtar kelime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-paper border border-steel/30 rounded pl-8 pr-3 py-1.5 text-ink placeholder:text-steel/50 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            />
          </div>

          {/* Grid / List Görünüm Butonları */}
          <div className="hidden md:flex items-center border border-steel/30 rounded bg-paper p-0.5">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1 rounded ${layoutMode === 'grid' ? 'bg-navy text-brass' : 'text-steel hover:text-ink'}`}
              title="İki Sütunlu Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1 rounded ${layoutMode === 'list' ? 'bg-navy text-brass' : 'text-steel hover:text-ink'}`}
              title="Tek Sütunlu Liste"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sonuç Sayısı Bildirimi */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12 font-mono text-steel">
          Aradığınız kriterlere uygun haber bulunamadı.
        </div>
      ) : (
        <div
          className={
            layoutMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
              : 'flex flex-col gap-5'
          }
        >
          {filteredNews.map((haber, index) => (
            <NewsCard
              key={haber.id || haber.kaynak_url}
              haber={haber}
              isFeatured={index === 0 && selectedSource === 'all' && searchQuery === ''}
            />
          ))}
        </div>
      )}
    </div>
  );
};
