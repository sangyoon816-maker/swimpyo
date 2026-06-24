import type { Metadata, Viewport } from 'next';
import './globals.css';
import BottomNav from '@/components/layout/BottomNav';
import AuthStoreSync from '@/components/common/AuthStoreSync';
import ToastContainer from '@/components/common/ToastContainer';
import { SITE_URL } from '@/lib/site';

const TITLE = '쉼표 — 내 동네 힐링 장소';
const DESCRIPTION = '지금 내 상태에 맞는 쉼 공간을 찾아드립니다. 공원, 카페, 산책길, 전망 명소까지.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | 쉼표',
    default: TITLE,
  },
  description: DESCRIPTION,
  keywords: ['힐링', '산책', '공원', '카페', '동네', '쉼터', '감성'],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: '쉼표',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAF9F6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased bg-[#FAF9F6]">
        <div className="relative min-h-dvh max-w-[430px] mx-auto bg-[#FAF9F6] shadow-[0_0_60px_rgba(0,0,0,0.06)]">
          <AuthStoreSync />
          <ToastContainer />
          <main className="pb-20">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
