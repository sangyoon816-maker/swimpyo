import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import MypageClient from './MypageClient';

export const metadata: Metadata = { title: '마이페이지' };

export default function MypagePage() {
  return (
    <div>
      <PageHeader title="마이" showBack={false} />
      <MypageClient />
    </div>
  );
}
