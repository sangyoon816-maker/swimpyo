import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import RecordClient from './RecordClient';

export const metadata: Metadata = { title: '마음 기록' };

export default function RecordPage() {
  return (
    <div>
      <PageHeader title="마음 기록" showBack={false} />
      <RecordClient />
    </div>
  );
}
