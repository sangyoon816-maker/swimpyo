import type { MetadataRoute } from 'next';
import { PLACES } from '@/data/places';
import { COURSES } from '@/data/courses';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/places`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/courses`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/map`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/record`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const placeRoutes: MetadataRoute.Sitemap = PLACES.map((place) => ({
    url: `${SITE_URL}/places/${place.id}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const courseRoutes: MetadataRoute.Sitemap = COURSES.map((course) => ({
    url: `${SITE_URL}/courses/${course.id}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...placeRoutes, ...courseRoutes];
}
