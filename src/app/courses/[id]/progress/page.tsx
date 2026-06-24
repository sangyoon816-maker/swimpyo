import { notFound } from 'next/navigation';
import { getCourseById } from '@/data/courses';
import PageHeader from '@/components/layout/PageHeader';
import CourseProgressClient from './CourseProgressClient';

interface CourseProgressPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseProgressPage({ params }: CourseProgressPageProps) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) notFound();

  return (
    <div>
      <PageHeader title={course.name} />
      <CourseProgressClient course={course} />
    </div>
  );
}

export async function generateStaticParams() {
  const { COURSES } = await import('@/data/courses');
  return COURSES.map((c) => ({ id: c.id }));
}
