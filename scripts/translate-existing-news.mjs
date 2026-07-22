import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('❌ HATA: SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY ortam değişkeni tanımlı değil!');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

async function translateAllExistingNews() {
  console.log('🌐 YZ PUSULA - Veritabanındaki Mevcut Haberleri Türkçe Çevirme İşlemi Başladı...');

  const { data: haberler, error } = await supabase
    .from('haberler')
    .select('id, baslik, ozet, kaynak_adi')
    .order('yayin_tarihi', { ascending: false });

  if (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }

  console.log(`📊 Toplam ${haberler.length} haber taranıyor...`);
  let translatedCount = 0;

  for (let i = 0; i < haberler.length; i++) {
    const haber = haberler[i];
    const needsTitleTranslation = !/[çğıöşüÇĞİÖŞÜ]/.test(haber.baslik);
    const needsSummaryTranslation = haber.ozet && !/[çğıöşüÇĞİÖŞÜ]/.test(haber.ozet);

    if (needsTitleTranslation || needsSummaryTranslation) {
      console.log(`\n[${i + 1}/${haberler.length}] 🔄 Çevriliyor (${haber.kaynak_adi}): "${haber.baslik.substring(0, 45)}..."`);

      const newTitle = needsTitleTranslation ? await translateToTurkish(haber.baslik) : haber.baslik;
      const newSummary = needsSummaryTranslation ? await translateToTurkish(haber.ozet) : haber.ozet;

      const { error: updateError } = await supabase
        .from('haberler')
        .update({
          baslik: newTitle,
          ozet: newSummary,
        })
        .eq('id', haber.id);

      if (updateError) {
        console.error(`❌ Güncelleme hatası (${haber.id}):`, updateError.message);
      } else {
        translatedCount++;
        console.log(`   ✅ Başarıyla Türkçe'ye Çevrildi -> "${newTitle.substring(0, 45)}..."`);
      }
    }
  }

  console.log(`\n🎉 Toplam ${translatedCount} adet İngilizce haber başarıyla Türkçe'ye çevrildi ve veritabanı güncellendi!`);
  process.exit(0);
}

translateAllExistingNews().catch((err) => {
  console.error(err);
  process.exit(1);
});
