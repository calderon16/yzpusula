import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://facoyzosjmukbtbqszdq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY295em9zam11a2J0YnFzemRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcxOTA4MiwiZXhwIjoyMTAwMjk1MDgyfQ.t8TbIayIKQbwOlx1gaDoBgd_ciH0hhQmOlNQFgFbD4A';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * İki metin arasındaki Jaccard kelime benzerliğini (0 - 1.0) hesaplar
 */
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

async function runDeduplication() {
  console.log('🔍 YZ PUSULA - Çift/Tekrar Eden Haberleri Temizleme Başladı...');

  const { data: haberler, error } = await supabase
    .from('haberler')
    .select('*')
    .order('yayin_tarihi', { ascending: false });

  if (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }

  console.log(`📊 Toplam ${haberler.length} haber inceleniyor...`);

  const idsToDelete = new Set();
  const keptHaberler = [];

  for (let i = 0; i < haberler.length; i++) {
    const current = haberler[i];
    if (idsToDelete.has(current.id)) continue;

    keptHaberler.push(current);

    for (let j = i + 1; j < haberler.length; j++) {
      const target = haberler[j];
      if (idsToDelete.has(target.id)) continue;

      const similarity = getSimilarityScore(current.baslik, target.baslik);

      // %60 veya üzeri başlık benzerliği varsa veya tam olarak aynı kaynak URL ise
      if (similarity >= 0.60 || current.kaynak_url === target.kaynak_url) {
        console.log(`\n🗑️ Çift Haber Tespit Edildi:`);
        console.log(`   └─ Ana: "${current.baslik.substring(0, 50)}..." (${current.kaynak_adi})`);
        console.log(`   └─ Çift: "${target.baslik.substring(0, 50)}..." (${target.kaynak_adi}) [Benzerlik: %${Math.round(similarity * 100)}]`);
        idsToDelete.add(target.id);
      }
    }
  }

  console.log(`\n🧹 Toplam ${idsToDelete.size} adet çift/tekrarlayan haber silinecek...`);

  if (idsToDelete.size > 0) {
    const deleteList = Array.from(idsToDelete);
    const { error: deleteError } = await supabase
      .from('haberler')
      .delete()
      .in('id', deleteList);

    if (deleteError) {
      console.error('❌ Silme hatası:', deleteError.message);
    } else {
      console.log(`✅ ${idsToDelete.size} tekrarlayan haber veritabanından başarıyla temizlendi!`);
    }
  } else {
    console.log('✨ Temizlenecek çift haber bulunamadı.');
  }

  console.log('\n🎉 Temizleme İşlemi Tamamlandı!');
  process.exit(0);
}

runDeduplication().catch((err) => {
  console.error(err);
  process.exit(1);
});
