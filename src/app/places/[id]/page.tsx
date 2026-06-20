import { notFound } from 'next/navigation';
import { getPlaceById } from '@/data/places';
import PlaceDetailClient from './PlaceDetailClient';
import type { Emotion } from '@/types';

interface PlaceDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ emotion?: string }>;
}

export default async function PlaceDetailPage({ params, searchParams }: PlaceDetailPageProps) {
  const { id } = await params;
  const { emotion } = await searchParams;
  const place = getPlaceById(id);

  if (!place) notFound();

  return <PlaceDetailClient place={place} contextEmotion={emotion as Emotion | undefined} />;
}

export async function generateStaticParams() {
  const { PLACES } = await import('@/data/places');
  return PLACES.map((p) => ({ id: p.id }));
}
