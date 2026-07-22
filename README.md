# 🧭 YZ PUSULA — Yapay Zeka Haber Pusulası

> **Dünyadaki Yapay Zeka haberlerini otomatik toplayıp yayınlayan tamamen ücretsiz (0 TL maliyetli) Türkçe haber platformu.**

![YZ Pusula Stack](https://img.shields.io/badge/Stack-Next.js%2014%20%7C%20Supabase%20%7C%20GitHub%20Actions%20%7C%20Vercel-0F1B2D?style=for-the-badge)

---

## 📌 Özellikler

- 🤖 **Tam Otomasyon:** GitHub Actions Cron Job ile günde 3 kez (TSİ 08:00, 14:00, 20:00) otomatik RSS taraması.
- 💰 **0 TL Maliyet:** Vercel Free Plan, Supabase Free PostgreSQL ve GitHub Actions ücretsiz kotaları ile sıfır harcama.
- 🧭 **Signature Pusula İbresi:** En yeni haberin tazeliğine göre rotasyon değiştiren ve Kuzey'i gösteren canlı SVG pusula animasyonu.
- 🗞️ **Gazete / Ajans Estetiği:** `#151C29` (ink), `#F6F4EF` (paper kağıt dokusu), `#0F1B2D` (navy) ve `#B08D57` (altın pirinç) renk paleti ile *Newsreader* serif tipografisi.
- 🔍 **Arama ve Kaynak Filtreleme:** TechCrunch, The Verge, VentureBeat, MIT Tech Review ve Webrazzi haberlerini anlık arama ve kaynak bazlı filtreleme.
- 📱 **Tam Responsive ve Erişilebilir:** Mobil cihazlar ve klavye gezintisi için özel tasarlanmış modern arayüz.

---

## 🛠️ Teknolojiler (Stack)

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Veritabanı:** Supabase PostgreSQL (`haberler` tablosu, DESC indeks, RLS güvenlik politikası)
- **Otomasyon / Bot:** Node.js `rss-parser` paketi (`scripts/fetch-news.mjs`)
- **Cron Job:** GitHub Actions Workflow (`.github/workflows/fetch-news.yml`)
- **Hosting:** Vercel

---

## 🚀 Adım Adım Kurulum Rehberi

### 1. Projeyi Yerel Ortama İndirin ve Bağımlılıkları Yükleyin

```bash
git clone https://github.com/kullanici-adi/yzpusula.git
cd yzpusula
npm install
```

---

### 2. Supabase Veritabanı Kurulumu (Ücretsiz)

1. [Supabase.com](https://supabase.com) üzerinde ücretsiz bir hesap açın ve yeni bir proje oluşturun.
2. Sol menüden **SQL Editor** sekmesine gidin.
3. Repodaki [`supabase/schema.sql`](./supabase/schema.sql) dosyasındaki SQL kodunu yapıştırıp **RUN** butonuna basın.
4. Bu işlem `haberler` tablosunu, indeksleri ve okuma (RLS) politikasını otomatik oluşturacaktır.
5. Sol menüden **Project Settings > API** bölümüne geçerek şu bilgileri not edin:
   - `Project URL`
   - `anon public` key
   - `service_role secret` key

---

### 3. Ortam Değişkenlerini (Env) Tanımlayın

Kök dizinde `.env.local` dosyası oluşturun (`.env.example` dosyasından kopyalayabilirsiniz):

```env
# Supabase Kamu / Frontend Bağlantısı
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Supabase Yönetici Key (Sadece backend/scriptler için)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

---

### 4. İlk Haberleri Yerel Ortamda Çekin

Terminalde aşağıdaki komutu çalıştırarak RSS akışlarını Supabase'e kaydedin:

```bash
node scripts/fetch-news.mjs
# veya
npm run fetch-news
```

Ardından geliştirici sunucusunu başlatın:

```bash
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açarak projenizi ve pusula ibresini inceleyebilirsiniz.

---

### 5. GitHub Actions Secrets Ayarı (Otomatik Cron Job İçin)

GitHub reposuna gidin:
1. **Settings > Secrets and variables > Actions** sekmesine tıklayın.
2. **New repository secret** butonuna basarak iki adet secret ekleyin:
   - Name: `SUPABASE_URL` | Value: `https://your-project.supabase.co`
   - Name: `SUPABASE_SERVICE_ROLE_KEY` | Value: `your-service-role-key`

> 💡 **Not:** Workflow her gün TSİ 08:00, 14:00 ve 20:00 saatlerinde otomatik çalışır. Dilerseniz GitHub Actions sekmesinden **"Run workflow"** butonuna basarak istediğiniz an manuel çalıştırabilirsiniz.

---

### 6. Vercel Üzerinde Yayınlama (Deploy)

1. [Vercel.com](https://vercel.com) üzerinde hesabınızla oturum açın ve **Add New > Project** seçeneğini tıklayın.
2. GitHub reposunu seçin.
3. **Environment Variables** bölümüne şu iki değişkeni ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy** butonuna basın. Siteniz saniyeler içinde `yzpusula.vercel.app` (veya belirlediğiniz özel alanda) canlıya geçecektir!

---

## 🗄️ Veritabanı Şeması (`haberler`)

```sql
create table haberler (
  id uuid primary key default gen_random_uuid(),
  baslik text not null,
  ozet text not null,
  kaynak_url text not null unique,
  kaynak_adi text not null,
  yayin_tarihi timestamptz not null default now(),
  eklenme_tarihi timestamptz not null default now()
);
```

---

## 📜 Lisans & Haklar

Bu proje açık kaynaklıdır. Çekilen haber başlıkları ve özetleri ilgili haber kaynaklarının (TechCrunch, The Verge, VentureBeat, MIT Tech Review vb.) mülkiyetindedir.
