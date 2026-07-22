import type { Metadata } from 'next';
import { Newsreader, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  adjustFontFallback: false,
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'YZ PUSULA | Yapay Zeka Haberleri & Anlık Gelişmeler',
  description:
    'Dünyada yapay zeka alanındaki yeni modeller, şirket haberleri, araştırmalar ve ürün lansmanlarını otomatik toplayan tarafsız Türkçe haber platformu.',
  keywords: [
    'Yapay Zeka',
    'AI',
    'Haberler',
    'TechCrunch AI',
    'The Verge AI',
    'ChatGPT',
    'LLM',
    'Machine Learning',
    'YZ Pusula',
  ],
  authors: [{ name: 'YZ Pusula Ekibi' }],
  openGraph: {
    title: 'YZ PUSULA | Yapay Zeka Haber Pusulası',
    description:
      'Dünyada yapay zeka alanında gerçekleşen tüm gelişmeleri anlık ve Türkçe olarak takip edin.',
    type: 'website',
    locale: 'tr_TR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${newsreader.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-paper text-ink selection:bg-brass/30 selection:text-navy">
        {children}
      </body>
    </html>
  );
}
