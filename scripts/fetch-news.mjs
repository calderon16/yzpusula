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
    'User-Agent': 'YZPusula-NewsBot/1.0 (+https://yzpusula.vercel.app)',
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

function getSimilarityScore(text1, text2) {
  if (!text1 || !text2) return 0;
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[^\w\sçğıöşü]/gi, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const words1 = new Set(normalize(text1));
  const words2 = new Set(normalize(text2));

  if (words1.size === 0 || words2.size === 0) return 0;
  const intersection = [...words1].filter((x) => words2.has(x));
  const union = new Set([...words1, ...words2]);
  return intersection.length / union.size;
}

function extractImageUrl(item, title, feedName) {
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
  return DIVERSE_FALLBACK_IMAGES[charSum % DIVERSE_FALLBACK_IMAGES.length];
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

function formatSummary(rawSummary) {
  const cleaned = cleanText(rawSummary);
  if (!cleaned) return 'Detaylı özet henüz bulunmuyor. Makalenin tamamını orijinal kaynağından inceleyebilirsiniz.';
  if (cleaned.length <= 1200) return cleaned;
  return cleaned.substring(0, 1197) + '...';
}

async function runFetchNews() {
  console.log(`🧭 YZ PUSULA - Çeşitli Görsel Destekli RSS Çekme Başladı [${new Date().toISOString()}]`);

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

        const isDuplicate = existingTitles.some((existing) => {
          if (existing.url === link) return true;
          const similarity = getSimilarityScore(existing.baslik, title);
          return similarity >= 0.55;
        });

        if (isDuplicate) {
          totalSkipped++;
          continue;
        }

        const resimUrl = extractImageUrl(item, title, feedConfig.name);

        const { data, error } = await supabase
          .from('haberler')
          .upsert(
            {
              baslik: title,
              ozet: summary,
              kaynak_url: link,
              kaynak_adi: feedConfig.name,
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
          console.log(`   ✅ Yeni Özgün Görselli Haber: "${title.substring(0, 45)}..."`);
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

  console.log('\n==================================================');
  console.log(`🎉 RSS Çekme & Benzersiz Görsel Atama Tamamlandı!`);
  console.log('==================================================\n');

  process.exit(0);
}

runFetchNews().catch((err) => {
  console.error('Kritik Hata:', err);
  process.exit(1);
});
