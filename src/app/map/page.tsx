import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import MapClient from './MapClient';

export const metadata: Metadata = { title: '지도로 탐색' };

export default function MapPage() {
  return (
    <div>
      <PageHeader title="지도로 탐색" showBack={false} />
      <MapClient />
    </div>
  );
}
