import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://facoyzosjmukbtbqszdq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY295em9zam11a2J0YnFzemRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcxOTA4MiwiZXhwIjoyMTAwMjk1MDgyfQ.t8TbIayIKQbwOlx1gaDoBgd_ciH0hhQmOlNQFgFbD4A';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Makalenin orijinal web sayfasından gerçek og:image / twitter:image görselini çeker
 */
async function fetchRealOgImage(pageUrl) {
  if (!pageUrl || !/^https?:\/\//i.test(pageUrl)) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const html = await res.text();

    // 1. og:image
    let match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    
    // 2. twitter:image
    if (!match) {
      match = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
              html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
    }

    // 3. link rel="image_src"
    if (!match) {
      match = html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i);
    }

    if (match && match[1]) {
      let imageUrl = match[1].trim();
      // HTML Entity çözümü (&amp; -> &)
      imageUrl = imageUrl.replace(/&amp;/g, '&');
      
      // Göreli URL ise tam URL yap
      if (imageUrl.startsWith('/')) {
        const parsedUrl = new URL(pageUrl);
        imageUrl = `${parsedUrl.origin}${imageUrl}`;
      }

      if (/^https?:\/\//i.test(imageUrl)) {
        return imageUrl;
      }
    }
  } catch (err) {
    // Sayfa çekilemezse sessizce geç
  }
  return null;
}

async function scrapeAllRealNewsImages() {
  console.log('📰 YZ PUSULA - Makalelerin Orijinal Sayfalarından Gerçek Fotoğrafları Çekme Başladı...');

  const { data: haberler, error } = await supabase
    .from('haberler')
    .select('id, baslik, kaynak_url, kaynak_adi, resim_url')
    .order('yayin_tarihi', { ascending: false });

  if (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }

  console.log(`📊 Toplam ${haberler.length} haberin orijinal web sayfası taranıyor...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < haberler.length; i++) {
    const haber = haberler[i];
    console.log(`\n[${i + 1}/${haberler.length}] 🔗 Taratılıyor: ${haber.kaynak_adi} -> "${haber.baslik.substring(0, 45)}..."`);
    
    const realImage = await fetchRealOgImage(haber.kaynak_url);

    if (realImage) {
      console.log(`   📸 GERÇEK ORİJİNAL HABER RESMİ BULUNDU: ${realImage}`);
      const { error: updateError } = await supabase
        .from('haberler')
        .update({ resim_url: realImage })
        .eq('id', haber.id);

      if (!updateError) {
        successCount++;
      } else {
        console.error(`   ❌ Güncelleme hatası: ${updateError.message}`);
        failCount++;
      }
    } else {
      console.log(`   ⚠️ Orijinal web sayfasından resim alınamadı, mevcut resim korundu.`);
      failCount++;
    }
  }

  console.log('\n==================================================');
  console.log(`🎉 Orijinal Gerçek Haber Fotoğrafları Güncellendi!`);
  console.log(`✅ Orijinal Sayfasından Çekilen Gerçek Resimler: ${successCount}`);
  console.log(`⚠️ Alınamayan/Mevcut Kalan: ${failCount}`);
  console.log('==================================================\n');

  process.exit(0);
}

scrapeAllRealNewsImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
