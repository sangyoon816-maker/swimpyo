import { redirect } from 'next/navigation';
import RecommendClient from './RecommendClient';
import type { DiagnosisAnswers, Emotion, SocialPreference, SpacePreference, WalkPreference } from '@/types';

interface RecommendPageProps {
  searchParams: Promise<{
    emotion?: string;
    social?: string;
    walk?: string;
    space?: string;
  }>;
}

const VALID_EMOTIONS: Emotion[] = ['tired', 'stressed', 'depressed', 'need-clarity', 'just-rest'];

export default async function RecommendPage({ searchParams }: RecommendPageProps) {
  const params = await searchParams;
  const emotion = params.emotion as Emotion | undefined;

  if (!emotion || !VALID_EMOTIONS.includes(emotion)) {
    redirect('/');
  }

  const hasFullAnswers =
    params.social && params.walk && params.space;

  const answers: DiagnosisAnswers | undefined = hasFullAnswers
    ? {
        social: params.social as SocialPreference,
        walk: params.walk as WalkPreference,
        space: params.space as SpacePreference,
      }
    : undefined;

  return <RecommendClient emotion={emotion} answers={answers} />;
}
