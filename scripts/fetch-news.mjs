import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';

// Supabase Kurulumu (Service Role Key ile yetkili istemci)
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ HATA: SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ortam değişkenleri tanımlanmamış!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const parser = new Parser({
  headers: {
    'User-Agent': 'YZPusula-NewsBot/1.0 (+https://yzpusula.vercel.app)',
  },
  timeout: 10000,
});

// Otomatik takip edilen RSS kaynakları
const RSS_FEEDS = [
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    isForeign: true,
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    isForeign: true,
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    isForeign: true,
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    isForeign: true,
  },
  {
    name: 'Ars Technica AI',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    isForeign: true,
  },
  {
    name: 'Webrazzi',
    url: 'https://webrazzi.com/feed/',
    isForeign: false,
  },
];

/**
 * Ücretsiz Google Translate GTX Servisi ile Metni Türkçe'ye Çevirir
 */
export async function translateToTurkish(text) {
  if (!text || text.trim() === '') return text;
  // Eğer metinde belirgin Türkçe karakterler varsa veya boşsa
  if (/[çğıöşüÇĞİÖŞÜ]/.test(text)) return text;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!res.ok) return text;
    const data = await res.json();

    if (data && data[0]) {
      const translated = data[0].map((item) => item[0]).join('');
      return translated || text;
    }
    return text;
  } catch (err) {
    console.error('Çeviri hatası:', err.message);
    return text;
  }
}

/**
 * HTML etiketlerini ve fazla boşlukları temizler
 */
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, '') // HTML etiketlerini kaldır
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Özeti uygun uzunluğa kısaltır
 */
function formatSummary(rawSummary) {
  const cleaned = cleanText(rawSummary);
  if (!cleaned) return 'Özet bulunmuyor. Detaylar için kaynağı ziyaret edin.';
  if (cleaned.length <= 320) return cleaned;
  return cleaned.substring(0, 317) + '...';
}

async function runFetchNews() {
  console.log(`🧭 YZ PUSULA - RSS Haber Çekme & Türkçe Çeviri İşlemi Başladı [${new Date().toISOString()}]`);

  let totalFetched = 0;
  let totalInserted = 0;
  let totalSkipped = 0;

  for (const feedConfig of RSS_FEEDS) {
    console.log(`\n📡 Akış çekiliyor: ${feedConfig.name} (${feedConfig.url})`);
    try {
      const feed = await parser.parseURL(feedConfig.url);
      const items = feed.items || [];
      console.log(`   └─ Toplam ${items.length} haber bulundu.`);

      for (const item of items) {
        totalFetched++;
        let title = cleanText(item.title);
        const link = item.link || item.guid;
        const rawSummary = item.contentSnippet || item.summary || item.content || '';
        let summary = formatSummary(rawSummary);
        const pubDateStr = item.pubDate || item.isoDate || new Date().toISOString();
        const pubDate = new Date(pubDateStr).toISOString();

        if (!title || !link) {
          totalSkipped++;
          continue;
        }

        // Yabancı kaynak ise otomatik Türkçe'ye çevir
        if (feedConfig.isForeign) {
          title = await translateToTurkish(title);
          summary = await translateToTurkish(summary);
        }

        // Supabase'e ekleme / upsert (kaynak_url UNIQUE olduğu için çakışmada yok say)
        const { data, error } = await supabase
          .from('haberler')
          .upsert(
            {
              baslik: title,
              ozet: summary,
              kaynak_url: link,
              kaynak_adi: feedConfig.name,
              yayin_tarihi: pubDate,
            },
            { onConflict: 'kaynak_url', ignoreDuplicates: true }
          )
          .select('id');

        if (error) {
          console.error(`   ❌ Supabase Hata (${feedConfig.name}): ${error.message}`);
          totalSkipped++;
        } else if (data && data.length > 0) {
          console.log(`   ✅ Yeni Türkçe Haber Eklendi: "${title.substring(0, 45)}..."`);
          totalInserted++;
        } else {
          totalSkipped++; // Zaten var (ignoreDuplicates)
        }
      }
    } catch (err) {
      console.error(`   ⚠️ HATA (${feedConfig.name} çekilemedi):`, err.message);
    }
  }

  console.log('\n==================================================');
  console.log(`🎉 RSS Çekme & Otomatik Çeviri Tamamlandı!`);
  console.log(`📊 İşlenen: ${totalFetched} | ✨ Yeni Eklendi: ${totalInserted} | ⏩ Atlandı/Var Olan: ${totalSkipped}`);
  console.log('==================================================\n');

  process.exit(0);
}

runFetchNews().catch((err) => {
  console.error('Kritik Hata:', err);
  process.exit(1);
});
