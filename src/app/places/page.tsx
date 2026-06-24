import Link from 'next/link';
import { Map } from 'lucide-react';
import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import PlacesClient from './PlacesClient';

export const metadata: Metadata = { title: '장소 탐색' };

interface PlacesPageProps {
  searchParams: Promise<{ emotion?: string; q?: string }>;
}

export default async function PlacesPage({ searchParams }: PlacesPageProps) {
  const params = await searchParams;

  return (
    <div>
      <PageHeader
        title="장소 탐색"
        showBack={false}
        rightElement={
          <Link
            href="/map"
            aria-label="지도로 보기"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F0EDE8] text-[#1A1A1A]"
          >
            <Map size={20} strokeWidth={2} />
          </Link>
        }
      />
      <PlacesClient
        initialEmotion={params.emotion}
        initialQuery={params.q}
      />
    </div>
  );
}
