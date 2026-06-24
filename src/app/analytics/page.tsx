import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import AnalyticsClient from './AnalyticsClient';

export const metadata: Metadata = { title: '추천 분석' };

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="추천 분석" showBack={false} />
      <AnalyticsClient />
    </div>
  );
}
