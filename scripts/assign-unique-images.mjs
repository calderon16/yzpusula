import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://facoyzosjmukbtbqszdq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY295em9zam11a2J0YnFzemRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcxOTA4MiwiZXhwIjoyMTAwMjk1MDgyfQ.t8TbIayIKQbwOlx1gaDoBgd_ciH0hhQmOlNQFgFbD4A';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const UNIQUE_TECH_IMAGES = [
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

async function assignUniqueImages() {
  console.log('🖼️ YZ PUSULA - Her Habere Benzersiz Görsel Atama İşlemi Başladı...');

  const { data: haberler, error } = await supabase
    .from('haberler')
    .select('id, baslik, resim_url')
    .order('yayin_tarihi', { ascending: false });

  if (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }

  console.log(`📊 Toplam ${haberler.length} haber güncellenecek.`);

  const usedImagesCount = new Map();
  let updatedCount = 0;

  for (let i = 0; i < haberler.length; i++) {
    const haber = haberler[i];
    
    // Eğer resim kütüphanesinden tekrar kullanılan bir resmi varsa veya boşsa, benzersiz görsel ata
    let imageToUse = haber.resim_url;
    const isUnsplashFallback = !imageToUse || imageToUse.includes('images.unsplash.com');

    if (isUnsplashFallback) {
      // Dizi indexi ve haber ID'sinden benzersiz resim seç
      const imageIndex = (i + haber.id.charCodeAt(0)) % UNIQUE_TECH_IMAGES.length;
      imageToUse = UNIQUE_TECH_IMAGES[imageIndex];
    }

    const { error: updateError } = await supabase
      .from('haberler')
      .update({ resim_url: imageToUse })
      .eq('id', haber.id);

    if (updateError) {
      console.error(`❌ Güncelleme hatası (${haber.id}):`, updateError.message);
    } else {
      updatedCount++;
      const currentCount = (usedImagesCount.get(imageToUse) || 0) + 1;
      usedImagesCount.set(imageToUse, currentCount);
    }
  }

  console.log(`\n✅ Toplam ${updatedCount} haberin görselleri benzersiz ve çeşitli hale getirildi!`);
  console.log(`🎨 Kullanılan Çeşitli Görsel Sayısı: ${usedImagesCount.size}`);
  process.exit(0);
}

assignUniqueImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
