import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ HATA: SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ortam değişkenleri tanımlanmamış!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  },
  timeout: 10000,
});

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

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
];

/**
 * Makalenin orijinal web sayfasından og:image etiketini okur (görsel indirilmez, sadece URL döner)
 */
async function fetchRealOgImage(pageUrl) {
  if (!pageUrl || !/^https?:\/\//i.test(pageUrl)) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const html = await res.text();

    let match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
                html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
                html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i) ||
                html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i);

    if (match && match[1]) {
      let imageUrl = match[1].trim().replace(/&amp;/g, '&');
      if (imageUrl.startsWith('/')) {
        const parsedUrl = new URL(pageUrl);
        imageUrl = `${parsedUrl.origin}${imageUrl}`;
      }
      if (/^https?:\/\//i.test(imageUrl)) {
        return imageUrl;
      }
    }
  } catch (err) {
    // Sayfa çekilemezse null dön
  }
  return null;
}

/**
 * RSS etiketlerinden veya Fallback resimlerden alternatif görsel seçer
 */
function extractRssImage(item, title, feedName) {
  if (item.enclosure && item.enclosure.url && /\.(jpg|jpeg|png|webp|gif)/i.test(item.enclosure.url)) {
    return item.enclosure.url;
  }
  if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
    return item['media:content'].$.url;
  }
  if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
    return item['media:thumbnail'].$.url;
  }
  
  const htmlContent = item['content:encoded'] || item.content || item.summary || '';
  const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1] && /^https?:\/\//i.test(imgMatch[1])) {
    return imgMatch[1];
  }

  let charSum = 0;
  for (let i = 0; i < (title || feedName).length; i++) {
    charSum += (title || feedName).charCodeAt(i);
  }
  return FALLBACK_IMAGES[charSum % FALLBACK_IMAGES.length];
}

export async function translateToTurkish(text) {
  if (!text || text.trim() === '') return text;
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

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, '')
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
 * RSS'ten gelen özeti 2000 karaktere kadar saklar (2000'i geçerse keser)
 */
function formatSummary(rawSummary) {
  const cleaned = cleanText(rawSummary);
  if (!cleaned) return 'Detaylı özet henüz bulunmuyor. Makalenin tamamını orijinal kaynağından inceleyebilirsiniz.';
  if (cleaned.length <= 2000) return cleaned;
  return cleaned.substring(0, 1997) + '...';
}

async function runFetchNews() {
  console.log(`🧭 YZ PUSULA - Orijinal Fotoğraf ve 2000 Karakter Destekli Akıllı RSS Çekme Başladı [${new Date().toISOString()}]`);

  const { data: existingNews } = await supabase
    .from('haberler')
    .select('id, baslik, kaynak_url')
    .order('yayin_tarihi', { ascending: false })
    .limit(100);

  const existingTitles = existingNews ? existingNews.map((h) => ({ baslik: h.baslik, url: h.kaynak_url })) : [];

  let totalFetched = 0;
  let totalInserted = 0;
  let totalSkipped = 0;

  for (const feedConfig of RSS_FEEDS) {
    console.log(`\n📡 Akış çekiliyor: ${feedConfig.name} (${feedConfig.url})`);
    try {
      const feed = await parser.parseURL(feedConfig.url);
      const items = feed.items || [];

      for (const item of items) {
        totalFetched++;
        let title = cleanText(item.title);
        const link = item.link || item.guid;
        const rawContent = item['content:encoded'] || item.content || item.contentSnippet || item.summary || '';
        let summary = formatSummary(rawContent);
        const pubDateStr = item.pubDate || item.isoDate || new Date().toISOString();
        const pubDate = new Date(pubDateStr).toISOString();

        if (!title || !link) {
          totalSkipped++;
          continue;
        }

        if (feedConfig.isForeign) {
          title = await translateToTurkish(title);
          summary = await translateToTurkish(summary);
        }

        const isDuplicate = existingTitles.some((existing) => existing.url === link);
        if (isDuplicate) {
          totalSkipped++;
          continue;
        }

        // Orijinal web sayfasından og:image URL'sini çek (null ise null kalır)
        const gorselUrl = await fetchRealOgImage(link);
        
        // resimUrl alanına gorselUrl veya RSS etiketlerinden seçilen resmi koy
        const resimUrl = gorselUrl || extractRssImage(item, title, feedConfig.name);

        const { data, error } = await supabase
          .from('haberler')
          .upsert(
            {
              baslik: title,
              ozet: summary,
              kaynak_url: link,
              kaynak_adi: feedConfig.name,
              gorsel_url: gorselUrl,
              resim_url: resimUrl,
              yayin_tarihi: pubDate,
            },
            { onConflict: 'kaynak_url', ignoreDuplicates: true }
          )
          .select('id');

        if (error) {
          console.error(`   ❌ Supabase Hata: ${error.message}`);
          totalSkipped++;
        } else if (data && data.length > 0) {
          console.log(`   ✅ Haber Eklendi: "${title.substring(0, 45)}..." [og:image: ${gorselUrl ? 'VAR' : 'YOK'}]`);
          existingTitles.push({ baslik: title, url: link });
          totalInserted++;
        } else {
          totalSkipped++;
        }
      }
    } catch (err) {
      console.error(`   ⚠️ HATA (${feedConfig.name}):`, err.message);
    }
  }

  // 3) OTOMATİK TEMİZLİK (retention: 7 gün)
  console.log('\n🧹 7 Günden Eski Haberlerin Otomatik Temizliği Başlatılıyor...');
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  const { error: deleteError, count: deletedCount } = await supabase
    .from('haberler')
    .delete({ count: 'exact' })
    .lt('yayin_tarihi', sevenDaysAgo);

  if (deleteError) {
    console.error(`❌ Temizlik Hatası: ${deleteError.message}`);
  } else {
    console.log(`✅ ${deletedCount ?? 0} adet 7 günden eski haber veritabanından başarıyla silindi.`);
  }

  console.log('\n==================================================');
  console.log(`🎉 RSS Çekme ve Temizlik Tamamlandı!`);
  console.log(`📊 Çekilen: ${totalFetched} | Eklenen: ${totalInserted} | Atlanan: ${totalSkipped}`);
  console.log('==================================================\n');

  process.exit(0);
}

runFetchNews().catch((err) => {
  console.error('Kritik Hata:', err);
  process.exit(1);
});
