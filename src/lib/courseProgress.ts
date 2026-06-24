import { supabase } from '@/lib/supabase';
import type { CourseProgress } from '@/types';

export async function fetchCourseProgressList(userId: string): Promise<CourseProgress[]> {
  const { data, error } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as CourseProgress[];
}

export async function fetchActiveCourseProgress(
  userId: string,
  courseId: string
): Promise<CourseProgress | null> {
  const { data, error } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .is('completed_at', null)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as CourseProgress | null;
}

/** Resumes an existing in-progress attempt if one exists, otherwise starts a new one. */
export async function startCourseProgress(
  userId: string,
  courseId: string
): Promise<CourseProgress> {
  const existing = await fetchActiveCourseProgress(userId, courseId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from('course_progress')
    .insert({ user_id: userId, course_id: courseId, current_stop: 1 })
    .select()
    .single();

  if (error) throw error;
  return data as CourseProgress;
}

export async function advanceCourseProgress(
  userId: string,
  progressId: string,
  nextStop: number,
  isComplete: boolean
): Promise<CourseProgress> {
  const { data, error } = await supabase
    .from('course_progress')
    .update({
      current_stop: nextStop,
      completed_at: isComplete ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', progressId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as CourseProgress;
}

export async function abandonCourseProgress(userId: string, progressId: string): Promise<void> {
  const { data, error } = await supabase
    .from('course_progress')
    .delete()
    .eq('id', progressId)
    .eq('user_id', userId)
    .select('id');

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('코스를 중단하지 못했어요. 권한이 없거나 이미 처리된 진행입니다.');
  }
}

/** Deletes a completed course attempt — its recommendEngine area boost disappears
 * automatically too, since that boost is recomputed live from completed rows
 * on every recommendation request rather than being stored separately. */
export async function deleteCourseProgress(userId: string, progressId: string): Promise<void> {
  const { data, error } = await supabase
    .from('course_progress')
    .delete()
    .eq('id', progressId)
    .eq('user_id', userId)
    .select('id');

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('완주 기록을 삭제하지 못했어요. 권한이 없거나 이미 삭제된 기록입니다.');
  }
}

export async function fetchCompletedCoursesInRange(
  userId: string,
  startISO: string,
  endISO: string
): Promise<CourseProgress[]> {
  const { data, error } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .gte('completed_at', startISO)
    .lt('completed_at', endISO)
    .order('completed_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as CourseProgress[];
}

export async function fetchCompletedCourseCountBefore(userId: string, beforeISO: string): Promise<number> {
  const { count, error } = await supabase
    .from('course_progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .lt('completed_at', beforeISO);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchCompletedCourseIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('course_progress')
    .select('course_id')
    .eq('user_id', userId)
    .not('completed_at', 'is', null);

  if (error) throw error;
  return (data ?? []).map((row) => row.course_id as string);
}
