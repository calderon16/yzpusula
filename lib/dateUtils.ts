/**
 * Türkçe Göreli Zaman ve Tarih Yardımcısı
 */

export function getRelativeTimeString(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0) {
    return 'Az önce';
  }

  if (diffInSeconds < 60) {
    return 'Az önce';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} dk önce`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Dün';
  }
  if (diffInDays < 7) {
    return `${diffInDays} gün önce`;
  }

  // 7 günden eski ise gün.ay.yıl formatı
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * En son haberin kaç saat/dakika önce geldiğini ve pusula ibresinin açısını hesaplar
 * 0 derece = Tam Kuzey (En Taze News < 2 saat)
 * 25 derece = Kuzey-Doğu (2-6 saat)
 * 50 derece = Doğu (6-12 saat)
 * 90 derece = Güneydoğu (>12 saat)
 */
export function getCompassStatus(latestDateString?: string): {
  rotation: number;
  label: string;
  badge: string;
  isFresh: boolean;
} {
  if (!latestDateString) {
    return {
      rotation: 0,
      label: 'Sistem Beklemede',
      badge: 'Bozş Akış',
      isFresh: false,
    };
  }

  const latest = new Date(latestDateString);
  const now = new Date();
  const diffInMinutes = Math.max(0, Math.floor((now.getTime() - latest.getTime()) / (1000 * 60)));

  if (diffInMinutes < 120) {
    // 0 - 2 saat arası: Taze haber! Tam Kuzey yönü (0°)
    return {
      rotation: 0,
      label: `${diffInMinutes < 5 ? 'Az önce' : `${diffInMinutes} dk önce`} güncellendi`,
      badge: 'TAZE AKIŞ',
      isFresh: true,
    };
  } else if (diffInMinutes < 360) {
    // 2 - 6 saat arası
    const hours = Math.floor(diffInMinutes / 60);
    return {
      rotation: 20,
      label: `${hours} saat önce güncellendi`,
      badge: 'GÜNCEL',
      isFresh: false,
    };
  } else if (diffInMinutes < 720) {
    // 6 - 12 saat arası
    const hours = Math.floor(diffInMinutes / 60);
    return {
      rotation: 45,
      label: `${hours} saat önce güncellendi`,
      badge: 'DURGUN',
      isFresh: false,
    };
  } else {
    // > 12 saat
    return {
      rotation: 75,
      label: 'Son 12 saatte yeni veri yok',
      badge: 'BEKLEMEDE',
      isFresh: false,
    };
  }
}
