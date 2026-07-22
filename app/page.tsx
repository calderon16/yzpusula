'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase, Haber, isSupabaseConfigured } from '@/lib/supabase';
import { CompassHeader } from '@/components/CompassHeader';
import { NewsGrid } from '@/components/NewsGrid';
import { EmptyState } from '@/components/EmptyState';
import { Compass, Info, Github, ExternalLink } from 'lucide-react';

// Supabase henüz bağlanmamışsa veya boşsa gösterilecek gösterim amaçlı varsayılan haberler
const MOCK_DEMO_NEWS: Haber[] = [
  {
    id: '1',
    baslik: 'OpenAI Yeni Nesil Reasoning Modeli Strawberry ve O1 Sürümünü Duyurdu',
    ozet: 'OpenAI, karmaşık matematiksel mantık yürütme ve bilimsel problemleri çözmede insan seviyesine yaklaşan yeni o1 modelini tanıttı. Model düşünme zincirlerini derinleştiriyor.',
    kaynak_url: 'https://techcrunch.com/category/artificial-intelligence/',
    kaynak_adi: 'TechCrunch AI',
    yayin_tarihi: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 dakika önce
    eklenme_tarihi: new Date().toISOString(),
  },
  {
    id: '2',
    baslik: 'Anthropic Claude 3.5 Sonnet Güncellemesiyle Kodlama Yeteneklerini İki Katına Çıkardı',
    ozet: 'Yapay zeka araştırma şirketi Anthropic, Claude 3.5 Sonnet modelinin performans güncellemelerini yayınladı. Model bilgisayar arayüzlerini doğrudan kullanma kabiliyeti kazanıyor.',
    kaynak_url: 'https://www.theverge.com/rss/ai-artificial-intelligence/',
    kaynak_adi: 'The Verge AI',
    yayin_tarihi: new Date(Date.now() - 3 * 360 * 1000).toISOString(), // ~3.5 saat önce
    eklenme_tarihi: new Date().toISOString(),
  },
  {
    id: '3',
    baslik: 'Google DeepMind Protein Yapı Tahmininde AlphaFold 3 Üzerinde Büyük Atılım Gerçekleştirdi',
    ozet: 'Biyoloji ve yapay zekanın kesişim noktasında AlphaFold 3, DNA ve RNA etkileşimlerini yüksek hassasiyetle modelleyerek ilaç keşif süreçlerini hızlandırıyor.',
    kaynak_url: 'https://venturebeat.com/category/ai/',
    kaynak_adi: 'VentureBeat AI',
    yayin_tarihi: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), // 8 saat önce
    eklenme_tarihi: new Date().toISOString(),
  },
  {
    id: '4',
    baslik: 'MIT Araştırmacıları Otonom Sistemler İçin Ultra Düşük Enerjili Çip Mimarisini Tanıttı',
    ozet: 'MIT Technology Review tarafından aktarılan habere göre, kenar cihazlarda (edge computing) yapay zeka çalıştırmayı %90 daha verimli kılan çip üretildi.',
    kaynak_url: 'https://www.technologyreview.com/',
    kaynak_adi: 'MIT Technology Review',
    yayin_tarihi: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), // 14 saat önce
    eklenme_tarihi: new Date().toISOString(),
  },
];

export default function HomePage() {
  const [news, setNews] = useState<Haber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isUsingDemo, setIsUsingDemo] = useState<boolean>(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setIsRefreshing(true);

    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('haberler')
          .select('*')
          .order('yayin_tarihi', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Supabase haber çekme hatası:', error.message);
          setNews(MOCK_DEMO_NEWS);
          setIsUsingDemo(true);
        } else if (data && data.length > 0) {
          setNews(data as Haber[]);
          setIsUsingDemo(false);
        } else {
          // Tablo boş ise demo verileri göster
          setNews(MOCK_DEMO_NEWS);
          setIsUsingDemo(true);
        }
      } catch (err) {
        console.error('Beklenmeyen hata:', err);
        setNews(MOCK_DEMO_NEWS);
        setIsUsingDemo(true);
      }
    } else {
      // Supabase konfigüre edilmemişse demo göster
      setNews(MOCK_DEMO_NEWS);
      setIsUsingDemo(true);
    }

    setLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const latestNewsDate = news.length > 0 ? news[0].yayin_tarihi : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Üst Masthead ve Pusula İbresi */}
      <CompassHeader
        latestNewsDate={latestNewsDate}
        totalNewsCount={news.length}
        onRefresh={fetchNews}
        isRefreshing={isRefreshing}
      />

      {/* Demo Modu Bilgilendirme Uyarısı (Eğer Supabase henüz kurulmadıysa) */}
      {isUsingDemo && (
        <div className="bg-brass/15 border-b border-brass/30 text-ink py-2 px-4 text-xs font-mono">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brass flex-shrink-0" />
              <span>
                <strong>ÖN İZLEME MODU:</strong> Şu an örnek veriler görüntülenmektedir. Supabase veritabanınızı bağladıktan sonra otomatik RSS akışı başlayacaktır.
              </span>
            </span>
            <span className="hidden md:inline text-steel text-[11px]">
              Vercel Ortam Değişkenleri: NEXT_PUBLIC_SUPABASE_URL & ANON_KEY
            </span>
          </div>
        </div>
      )}

      {/* Ana İçerik Alanı */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 font-mono text-steel">
            <Compass className="w-10 h-10 text-brass animate-spin-slow mb-3" />
            <p className="text-sm">Haber Akışı ve Pusula İbresi Yükleniyor...</p>
          </div>
        ) : news.length === 0 ? (
          <EmptyState isConfigured={isSupabaseConfigured} />
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
              Frontend: Next.js 14
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
              href="https://github.com"
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
