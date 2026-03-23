import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NestKatalog — E-ticaret Ürün Kataloğu',
  description: 'NestJS + Next.js ile geliştirilmiş profesyonel ürün kataloğu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
