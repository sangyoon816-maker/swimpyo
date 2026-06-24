import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCourseById } from '@/data/courses';
import CourseDetailClient from './CourseDetailClient';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const course = getCourseById(id);
  if (!course) return {};

  return {
    title: course.name,
    description: course.description,
    openGraph: { title: course.name, description: course.description, images: [course.thumbnail] },
    twitter: { card: 'summary_large_image', title: course.name, description: course.description },
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) notFound();

  return <CourseDetailClient course={course} />;
}

export async function generateStaticParams() {
  const { COURSES } = await import('@/data/courses');
  return COURSES.map((c) => ({ id: c.id }));
}
