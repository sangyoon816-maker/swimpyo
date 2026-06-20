import { notFound } from 'next/navigation';
import { getCourseById } from '@/data/courses';
import CourseDetailClient from './CourseDetailClient';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
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
