import PageHeader from '@/components/layout/PageHeader';
import PlacesClient from './PlacesClient';

interface PlacesPageProps {
  searchParams: Promise<{ emotion?: string; q?: string }>;
}

export default async function PlacesPage({ searchParams }: PlacesPageProps) {
  const params = await searchParams;

  return (
    <div>
      <PageHeader title="장소 탐색" showBack={false} />
      <PlacesClient
        initialEmotion={params.emotion}
        initialQuery={params.q}
      />
    </div>
  );
}
