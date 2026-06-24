import { supabase } from '@/lib/supabase';
import type { Emotion, EmotionLog } from '@/types';

export async function insertEmotionLog(
  userId: string,
  emotion: Emotion,
  note?: string
): Promise<EmotionLog> {
  const { data, error } = await supabase
    .from('emotion_logs')
    .insert({ user_id: userId, emotion, note: note?.trim() ? note.trim() : null })
    .select()
    .single();

  if (error) throw error;
  return data as EmotionLog;
}

export async function fetchRecentEmotionLogs(
  userId: string,
  limit = 7
): Promise<EmotionLog[]> {
  const { data, error } = await supabase
    .from('emotion_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as EmotionLog[];
}

export async function fetchEmotionLogsSince(
  userId: string,
  sinceISO: string
): Promise<EmotionLog[]> {
  const { data, error } = await supabase
    .from('emotion_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', sinceISO)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as EmotionLog[];
}

export async function fetchEmotionLogsCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('emotion_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchEmotionLogsInRange(
  userId: string,
  startISO: string,
  endISO: string
): Promise<EmotionLog[]> {
  const { data, error } = await supabase
    .from('emotion_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startISO)
    .lt('created_at', endISO)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as EmotionLog[];
}

export async function fetchEmotionLogsCountBefore(userId: string, beforeISO: string): Promise<number> {
  const { count, error } = await supabase
    .from('emotion_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .lt('created_at', beforeISO);

  if (error) throw error;
  return count ?? 0;
}

export async function deleteEmotionLog(userId: string, logId: string): Promise<void> {
  // .select() forces PostgREST to return the deleted rows, so we can tell a
  // real deletion apart from a silent no-op (wrong id, or RLS denying the
  // row) — a plain .delete() with no matching rows also returns error: null.
  const { data, error } = await supabase
    .from('emotion_logs')
    .delete()
    .eq('id', logId)
    .eq('user_id', userId)
    .select('id');

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('기록을 삭제하지 못했어요. 권한이 없거나 이미 삭제된 기록입니다.');
  }
}
