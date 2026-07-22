-- YZ PUSULA Veritabanı Şeması
-- Supabase / PostgreSQL için Haberler Tablosu

CREATE TABLE IF NOT EXISTS haberler (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    baslik TEXT NOT NULL,
    ozet TEXT NOT NULL,
    kaynak_url TEXT UNIQUE NOT NULL,
    kaynak_adi VARCHAR(100) NOT NULL,
    resim_url TEXT,
    gorsel_url TEXT,
    yayin_tarihi TIMESTAMPTZ NOT NULL,
    eklenme_tarihi TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Yayın tarihine göre hızlı sıralama için İndeks
CREATE INDEX IF NOT EXISTS idx_haberler_yayin_tarihi ON haberler (yayin_tarihi DESC);

-- Herkese açık okuma yetkisi (RLS Policy)
ALTER TABLE haberler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkese Açık Okuma Yetkisi" 
ON haberler FOR SELECT 
TO public 
USING (true);
