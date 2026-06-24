import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPlaceById } from '@/data/places';
import PlaceDetailClient from './PlaceDetailClient';
import type { Emotion } from '@/types';

interface PlaceDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ emotion?: string }>;
}

export async function generateMetadata({ params }: PlaceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const place = getPlaceById(id);
  if (!place) return {};

  return {
    title: place.name,
    description: place.description,
    openGraph: { title: place.name, description: place.description, images: [place.thumbnail] },
    twitter: { card: 'summary_large_image', title: place.name, description: place.description },
  };
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
