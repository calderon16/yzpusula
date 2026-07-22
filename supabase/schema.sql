-- ====================================================================
-- YZ PUSULA - Supabase PostgreSQL Veritabanı Şeması
-- ====================================================================

-- 1. haberler tablosunun oluşturulması
CREATE TABLE IF NOT EXISTS public.haberler (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    baslik TEXT NOT NULL,
    ozet TEXT NOT NULL,
    kaynak_url TEXT NOT NULL UNIQUE,
    kaynak_adi TEXT NOT NULL,
    yayin_tarihi TIMESTAMPTZ NOT NULL DEFAULT now(),
    eklenme_tarihi TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Yayın tarihine göre hızlı sıralama için DESC indeks
CREATE INDEX IF NOT EXISTS idx_haberler_yayin_tarihi 
ON public.haberler (yayin_tarihi DESC);

-- 3. Row Level Security (RLS) Etkinleştirilmesi
ALTER TABLE public.haberler ENABLE ROW LEVEL SECURITY;

-- 4. Herkesin (anon/public) haberleri okuyabilmesi için SELECT politikası
DROP POLICY IF EXISTS "Herkese Açık Okuma Politikası" ON public.haberler;

CREATE POLICY "Herkese Açık Okuma Politikası" 
ON public.haberler 
FOR SELECT 
USING (true);

-- Not: Ekleme/Güncelleme/Silme politikası tanımlanmamıştır.
-- Bu sayede sadece Supabase SERVICE_ROLE_KEY ile çalışan backend/scriptler yazma hakkına sahip olur.
