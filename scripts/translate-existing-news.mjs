import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://facoyzosjmukbtbqszdq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY295em9zam11a2J0YnFzemRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcxOTA4MiwiZXhwIjoyMTAwMjk1MDgyfQ.t8TbIayIKQbwOlx1gaDoBgd_ciH0hhQmOlNQFgFbD4A';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function translateToTurkish(text) {
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

async function run() {
  console.log('🔄 Supabase Veritabanındaki Mevcut Haberleri Türkçe\'ye Çevirme Başladı...');

  const { data: haberler, error } = await supabase.from('haberler').select('*');
  if (error) {
    console.error('Hata:', error.message);
    process.exit(1);
  }

  console.log(`📊 Toplam ${haberler.length} haber inceleniyor...`);
  let updatedCount = 0;

  for (const item of haberler) {
    const isTurkish = /[çğıöşüÇĞİÖŞÜ]/.test(item.baslik) && /[çğıöşüÇĞİÖŞÜ]/.test(item.ozet);
    if (isTurkish) {
      continue;
    }

    console.log(`\n🔤 Çevriliyor [${item.kaynak_adi}]: ${item.baslik.substring(0, 40)}...`);
    const newBaslik = await translateToTurkish(item.baslik);
    const newOzet = await translateToTurkish(item.ozet);

    const { error: updateError } = await supabase
      .from('haberler')
      .update({ baslik: newBaslik, ozet: newOzet })
      .eq('id', item.id);

    if (updateError) {
      console.error(`❌ Güncelleme hatası (${item.id}):`, updateError.message);
    } else {
      console.log(`   ✅ Türkçe'ye çevrildi: ${newBaslik.substring(0, 45)}...`);
      updatedCount++;
    }
  }

  console.log(`\n🎉 İşlem Tamamlandı! Toplam ${updatedCount} haber Türkçe'ye çevrildi ve güncellendi.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
