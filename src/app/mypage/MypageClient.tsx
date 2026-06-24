'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart, MapPin, BookHeart, MessageSquare, Navigation, ChevronRight,
  Leaf, LogOut, Trash2, Pencil
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRecentEmotionLogs } from '@/hooks/useEmotionLogs';
import { useEmotionLogsCount } from '@/hooks/useEmotionLogsCount';
import { useDeleteEmotionLog } from '@/hooks/useDeleteEmotionLog';
import { useFavoritePlaces } from '@/hooks/useFavoritePlaces';
import { useVisitedPlaces } from '@/hooks/useVisitedPlaces';
import { useMyReviews } from '@/hooks/useMyReviews';
import { useCourseProgressList } from '@/hooks/useCourseProgress';
import { useEarnedBadges } from '@/hooks/useEarnedBadges';
import { updatePlaceReview, deletePlaceReview } from '@/lib/placeReviews';
import { deleteCourseProgress } from '@/lib/courseProgress';
import { computeXp } from '@/data/badges';
import { getPlaceById } from '@/data/places';
import { getCourseById } from '@/data/courses';
import { EMOTION_MAP } from '@/data/emotions';
import PlaceCard from '@/components/common/PlaceCard';
import EmptyState from '@/components/common/EmptyState';
import InsightCard from '@/components/common/InsightCard';
import LevelCard from '@/components/common/LevelCard';
import BadgeGrid from '@/components/common/BadgeGrid';
import MonthlyReportCard from '@/components/common/MonthlyReportCard';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ReviewFormDialog from '@/components/common/ReviewFormDialog';
import GoogleIcon from '@/components/common/GoogleIcon';
import { Skeleton } from '@/components/ui/skeleton';
import type { CourseProgress, EmotionLog, PlaceReview } from '@/types';

type Tab = 'saved' | 'visited' | 'emotions' | 'reviews' | 'courses';

export default function MypageClient() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { logs: recentLogs, loading: logsLoading, error: logsError, refresh: refreshLogs, removeLog } = useRecentEmotionLogs(user?.id);
  const { count: emotionLogsCount, decrement: decrementEmotionLogsCount } = useEmotionLogsCount(user?.id);
  const { places: favoritePlaces, loading: favoritesLoading, error: favoritesError, refresh: refreshFavorites } = useFavoritePlaces(user?.id);
  const { places: visitedPlacesList, loading: visitedLoading, error: visitedError, refresh: refreshVisited } = useVisitedPlaces(user?.id);
  const { remove: removeEmotionLog, deleting: deletingLog, error: deleteLogError, clearError: clearDeleteLogError } = useDeleteEmotionLog();
  const { reviews: myReviews, loading: reviewsLoading, error: reviewsError, refresh: refreshReviews, mutate: mutateReviews } = useMyReviews(user?.id);
  const { completed: completedCourses, inProgress: inProgressCourses, loading: coursesLoading, error: coursesError, refresh: refreshCourses, mutate: mutateCourses } = useCourseProgressList(user?.id);
  const { earnedBadges } = useEarnedBadges(user?.id);
  const [activeTab, setActiveTab] = useState<Tab>('saved');
  const [deleteTarget, setDeleteTarget] = useState<EmotionLog | null>(null);
  const [reviewEditTarget, setReviewEditTarget] = useState<PlaceReview | null>(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewFormError, setReviewFormError] = useState<string | null>(null);
  const [reviewDeleteTarget, setReviewDeleteTarget] = useState<PlaceReview | null>(null);
  const [deletingReview, setDeletingReview] = useState(false);
  const [deleteReviewError, setDeleteReviewError] = useState<string | null>(null);
  const [courseDeleteTarget, setCourseDeleteTarget] = useState<CourseProgress | null>(null);
  const [deletingCourse, setDeletingCourse] = useState(false);
  const [deleteCourseRecordError, setDeleteCourseRecordError] = useState<string | null>(null);

  const nickname = (user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? '나의 쉼표') as string;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  const xp = computeXp({
    visitedCount: visitedPlacesList.length,
    reviewCount: myReviews.length,
    completedCourseCount: completedCourses.length,
    emotionLogCount: emotionLogsCount,
  });
  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.badge_id));

  const TABS = [
    { id: 'saved' as Tab, label: '찜 목록', icon: Heart, count: favoritePlaces.length },
    { id: 'visited' as Tab, label: '방문 기록', icon: MapPin, count: visitedPlacesList.length },
    { id: 'emotions' as Tab, label: '감정 기록', icon: BookHeart, count: emotionLogsCount },
    { id: 'reviews' as Tab, label: '내 후기', icon: MessageSquare, count: myReviews.length },
    { id: 'courses' as Tab, label: '완주한 코스', icon: Navigation, count: completedCourses.length },
  ];

  const handleDeleteLog = async () => {
    if (!user || !deleteTarget) return;
    const success = await removeEmotionLog(user.id, deleteTarget.id);
    if (success) {
      removeLog(deleteTarget.id);
      decrementEmotionLogsCount();
      setDeleteTarget(null);
    }
  };

  const handleSubmitReviewEdit = async (content: string, liked: boolean) => {
    if (!user || !reviewEditTarget) return;
    setReviewSubmitting(true);
    setReviewFormError(null);
    try {
      const updated = await updatePlaceReview(user.id, reviewEditTarget.id, content, liked);
      mutateReviews((current) => current.map((r) => (r.id === updated.id ? updated : r)));
      setReviewEditTarget(null);
    } catch (err) {
      setReviewFormError(err instanceof Error ? err.message : '후기를 저장하지 못했어요');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!user || !reviewDeleteTarget) return;
    setDeletingReview(true);
    setDeleteReviewError(null);
    try {
      await deletePlaceReview(user.id, reviewDeleteTarget.id);
      mutateReviews((current) => current.filter((r) => r.id !== reviewDeleteTarget.id));
      setReviewDeleteTarget(null);
    } catch (err) {
      setDeleteReviewError(err instanceof Error ? err.message : '후기를 삭제하지 못했어요');
    } finally {
      setDeletingReview(false);
    }
  };

  const handleDeleteCourseRecord = async () => {
    if (!user || !courseDeleteTarget) return;
    setDeletingCourse(true);
    setDeleteCourseRecordError(null);
    try {
      await deleteCourseProgress(user.id, courseDeleteTarget.id);
      mutateCourses((current) => current.filter((p) => p.id !== courseDeleteTarget.id));
      setCourseDeleteTarget(null);
    } catch (err) {
      setDeleteCourseRecordError(err instanceof Error ? err.message : '완주 기록을 삭제하지 못했어요');
    } finally {
      setDeletingCourse(false);
    }
  };

  return (
    <div>
      {/* 프로필 섹션 */}
      <div className="bg-gradient-to-b from-[#EFF5EB] to-[#FAF9F6] px-4 pt-4 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#5F8D4E] flex items-center justify-center overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={nickname} width={64} height={64} className="w-full h-full object-cover" />
            ) : (
              <Leaf size={28} className="text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-bold text-[#1A1A1A] truncate">{nickname}</h2>
            <p className="text-sm text-[#6B7280] mt-0.5">
              {favoritePlaces.length}곳 찜 · {visitedPlacesList.length}곳 방문
            </p>
          </div>
          {user ? (
            <button
              onClick={() => signOut()}
              className="flex-shrink-0 flex items-center gap-1 h-9 px-3 bg-white rounded-full text-xs font-medium text-[#6B7280] border border-[#E8E4DD]"
            >
              <LogOut size={14} />
              로그아웃
            </button>
          ) : null}
        </div>

        {!user && !loading && (
          <button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#E8E4DD] rounded-2xl py-3 mt-4 text-[15px] font-semibold text-[#1A1A1A] shadow-sm hover:border-[#5F8D4E] transition-colors"
          >
            <GoogleIcon size={18} />
            Google로 로그인
          </button>
        )}

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: '찜한 곳', value: favoritePlaces.length, color: '#E07A5F' },
            { label: '방문한 곳', value: visitedPlacesList.length, color: '#5F8D4E' },
            { label: '감정 기록', value: emotionLogsCount, color: '#7B7FBF' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-[#F0EDE8]">
              <p className="text-[22px] font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs text-[#6B7280] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {user && (
        <div className="px-4 pt-4 space-y-4">
          <LevelCard xp={xp} />
          <div>
            <h3 className="text-sm font-bold text-[#1A1A1A] mb-2">획득 배지</h3>
            <BadgeGrid earnedBadgeIds={earnedBadgeIds} />
          </div>
        </div>
      )}

      <MonthlyReportCard userId={user?.id} />
      <InsightCard userId={user?.id} />

      {/* 탭 */}
      <div className="bg-white border-b border-[#E8E4DD] sticky top-0 z-20">
        <div className="flex">
          {TABS.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium relative transition-colors ${
                activeTab === id ? 'text-[#1A1A1A]' : 'text-[#6B7280]'
              }`}
            >
              <Icon
                size={18}
                className={activeTab === id ? 'text-[#5F8D4E]' : 'text-[#C4BFB8]'}
              />
              <span>{label}</span>
              {count > 0 && (
                <span
                  className={`absolute top-2 right-[calc(50%-18px)] text-[9px] font-bold px-1 rounded-full ${
                    activeTab === id
                      ? 'bg-[#5F8D4E] text-white'
                      : 'bg-[#E8E4DD] text-[#6B7280]'
                  }`}
                >
                  {count}
                </span>
              )}
              {activeTab === id && (
                <motion.div
                  layoutId="mypage-tab"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#5F8D4E] rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="px-4 py-4">
        {activeTab === 'saved' && (
          <div>
            {!user ? (
              <EmptyState
                emoji="🔒"
                title="로그인하면 찜 목록을 볼 수 있어요"
                desc={'Google로 로그인하면\n찜한 장소가 안전하게 보관돼요'}
              />
            ) : favoritesLoading ? (
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-[112px] w-full rounded-2xl" />
                ))}
              </div>
            ) : favoritesError ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-sm text-[#E07A5F]">{favoritesError}</p>
                <button
                  onClick={() => refreshFavorites()}
                  className="text-xs font-semibold text-[#5F8D4E] underline"
                >
                  다시 시도
                </button>
              </div>
            ) : favoritePlaces.length === 0 ? (
              <EmptyState
                emoji="💚"
                title="아직 저장한 쉼이 없어요"
                desc={'마음에 드는 장소를 저장해보세요'}
                href="/places"
                linkLabel="쉼 찾으러 가기"
              />
            ) : (
              <div className="flex flex-col gap-3">
                {favoritePlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} variant="horizontal" />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'visited' && (
          <div>
            {!user ? (
              <EmptyState
                emoji="🔒"
                title="로그인하면 방문 기록을 볼 수 있어요"
                desc={'Google로 로그인하면\n방문 기록이 안전하게 보관돼요'}
              />
            ) : visitedLoading ? (
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-[112px] w-full rounded-2xl" />
                ))}
              </div>
            ) : visitedError ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-sm text-[#E07A5F]">{visitedError}</p>
                <button
                  onClick={() => refreshVisited()}
                  className="text-xs font-semibold text-[#5F8D4E] underline"
                >
                  다시 시도
                </button>
              </div>
            ) : visitedPlacesList.length === 0 ? (
              <EmptyState
                emoji="🗺️"
                title="아직 방문한 장소가 없어요"
                desc="장소를 방문하고 '여기서 쉬기'를 눌러보세요"
                href="/places"
                linkLabel="장소 탐색하기"
              />
            ) : (
              <div className="flex flex-col gap-3">
                {visitedPlacesList.map((place) => (
                  <PlaceCard key={place.id} place={place} variant="horizontal" />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'emotions' && (
          <div>
            {!user ? (
              <EmptyState
                emoji="🔒"
                title="로그인하면 감정 기록을 볼 수 있어요"
                desc={'Google로 로그인하면\n감정 기록이 안전하게 보관돼요'}
              />
            ) : logsLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-[84px] w-full rounded-2xl" />
                ))}
              </div>
            ) : logsError ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-sm text-[#E07A5F]">{logsError}</p>
                <button
                  onClick={() => refreshLogs()}
                  className="text-xs font-semibold text-[#5F8D4E] underline"
                >
                  다시 시도
                </button>
              </div>
            ) : recentLogs.length === 0 ? (
              <EmptyState
                emoji="💭"
                title="아직 감정 기록이 없어요"
                desc="오늘의 감정을 기록하면 AI가 장소를 추천해줘요"
                href="/record"
                linkLabel="감정 기록하기"
              />
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => {
                  const conf = EMOTION_MAP[log.emotion];
                  return (
                    <div
                      key={log.id}
                      className="bg-white rounded-2xl border border-[#F0EDE8] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                          style={{ backgroundColor: conf?.bgColor }}
                        >
                          {conf?.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold" style={{ color: conf?.color }}>
                            {conf?.label}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            {new Date(log.created_at).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            clearDeleteLogError();
                            setDeleteTarget(log);
                          }}
                          className="flex-shrink-0 p-1.5 text-[#C4BFB8] hover:text-[#E07A5F] transition-colors"
                          aria-label="감정 기록 삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {log.note && (
                        <p className="text-sm text-[#4B5563] leading-relaxed mt-3 bg-[#F5F3EF] rounded-xl px-3 py-2.5">
                          {log.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {!user ? (
              <EmptyState
                emoji="🔒"
                title="로그인하면 내 후기를 볼 수 있어요"
                desc={'Google로 로그인하면\n작성한 후기가 안전하게 보관돼요'}
              />
            ) : reviewsLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-[100px] w-full rounded-2xl" />
                ))}
              </div>
            ) : reviewsError ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-sm text-[#E07A5F]">{reviewsError}</p>
                <button
                  onClick={() => refreshReviews()}
                  className="text-xs font-semibold text-[#5F8D4E] underline"
                >
                  다시 시도
                </button>
              </div>
            ) : myReviews.length === 0 ? (
              <EmptyState
                emoji="✍️"
                title="아직 작성한 후기가 없어요"
                desc="방문한 장소에 후기를 남겨보세요"
                href="/places"
                linkLabel="장소 탐색하기"
              />
            ) : (
              <div className="space-y-3">
                {myReviews.map((review) => {
                  const place = getPlaceById(review.place_id);
                  return (
                    <div
                      key={review.id}
                      className="bg-white rounded-2xl border border-[#F0EDE8] p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[14px] font-semibold text-[#1A1A1A] truncate">
                          {place?.name ?? '삭제된 장소'}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => {
                              setReviewFormError(null);
                              setReviewEditTarget(review);
                            }}
                            className="p-1.5 text-[#C4BFB8] hover:text-[#5F8D4E] transition-colors"
                            aria-label="후기 수정"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteReviewError(null);
                              setReviewDeleteTarget(review);
                            }}
                            className="p-1.5 text-[#C4BFB8] hover:text-[#E07A5F] transition-colors"
                            aria-label="후기 삭제"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            review.liked
                              ? 'bg-[#EFF5EB] text-[#5F8D4E]'
                              : 'bg-[#FDF0ED] text-[#E07A5F]'
                          }`}
                        >
                          {review.liked ? '👍 좋아요' : '👎 별로예요'}
                        </span>
                        <span className="text-xs text-[#6B7280]">
                          {new Date(review.created_at).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-sm text-[#4B5563] leading-relaxed">{review.content}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            {!user ? (
              <EmptyState
                emoji="🔒"
                title="로그인하면 완주한 코스를 볼 수 있어요"
                desc={'Google로 로그인하면\n코스 진행 기록이 안전하게 보관돼요'}
              />
            ) : coursesLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-[68px] w-full rounded-2xl" />
                ))}
              </div>
            ) : coursesError ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-sm text-[#E07A5F]">{coursesError}</p>
                <button
                  onClick={() => refreshCourses()}
                  className="text-xs font-semibold text-[#5F8D4E] underline"
                >
                  다시 시도
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-[#F0EDE8]">
                    <p className="text-[22px] font-bold text-[#5F8D4E]">{completedCourses.length}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">완주 횟수</p>
                  </div>
                  <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-[#F0EDE8]">
                    <p className="text-[22px] font-bold text-[#7B7FBF]">{inProgressCourses.length}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">진행 중 코스</p>
                  </div>
                </div>

                {inProgressCourses.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A] mb-2">진행 중인 코스</h3>
                    <div className="space-y-2">
                      {inProgressCourses.map((p) => {
                        const course = getCourseById(p.course_id);
                        if (!course) return null;
                        return (
                          <Link
                            key={p.id}
                            href={`/courses/${course.id}/progress`}
                            className="flex items-center gap-3 bg-white rounded-2xl border border-[#F0EDE8] p-3"
                          >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                              <Image src={course.thumbnail} alt={course.name} fill className="object-cover" sizes="48px" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-semibold text-[#1A1A1A] truncate">{course.name}</p>
                              <p className="text-xs text-[#6B7280]">
                                {p.current_stop}/{course.places.length} 진행 중
                              </p>
                            </div>
                            <ChevronRight size={16} className="text-[#C4BFB8] flex-shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] mb-2">완주한 코스</h3>
                  {completedCourses.length === 0 ? (
                    <EmptyState
                      emoji="🏁"
                      title="아직 완주한 코스가 없어요"
                      desc="코스를 시작해서 완주해보세요"
                      href="/courses"
                      linkLabel="코스 보러가기"
                    />
                  ) : (
                    <div className="space-y-2">
                      {completedCourses.map((p) => {
                        const course = getCourseById(p.course_id);
                        if (!course) return null;
                        return (
                          <div
                            key={p.id}
                            className="flex items-center gap-2 bg-white rounded-2xl border border-[#F0EDE8] p-3"
                          >
                            <Link
                              href={`/courses/${course.id}`}
                              className="flex items-center gap-3 flex-1 min-w-0"
                            >
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                                <Image src={course.thumbnail} alt={course.name} fill className="object-cover" sizes="48px" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-semibold text-[#1A1A1A] truncate">{course.name}</p>
                                <p className="text-xs text-[#6B7280]">
                                  {p.completed_at &&
                                    new Date(p.completed_at).toLocaleDateString('ko-KR')}{' '}
                                  완주
                                </p>
                              </div>
                              <ChevronRight size={16} className="text-[#C4BFB8] flex-shrink-0" />
                            </Link>
                            <button
                              onClick={() => {
                                setDeleteCourseRecordError(null);
                                setCourseDeleteTarget(p);
                              }}
                              className="flex-shrink-0 p-1.5 text-[#C4BFB8] hover:text-[#E07A5F] transition-colors"
                              aria-label="완주 기록 삭제"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            clearDeleteLogError();
          }
        }}
        title="감정 기록을 삭제할까요?"
        description={deleteLogError ?? '삭제하면 되돌릴 수 없어요.'}
        loading={deletingLog}
        onConfirm={handleDeleteLog}
      />

      <ReviewFormDialog
        open={!!reviewEditTarget}
        onOpenChange={(open) => {
          if (!open) {
            setReviewEditTarget(null);
            setReviewFormError(null);
          }
        }}
        placeName={reviewEditTarget ? getPlaceById(reviewEditTarget.place_id)?.name ?? '장소' : ''}
        initialContent={reviewEditTarget?.content ?? ''}
        initialLiked={reviewEditTarget?.liked ?? null}
        submitting={reviewSubmitting}
        error={reviewFormError}
        onSubmit={handleSubmitReviewEdit}
      />

      <ConfirmDialog
        open={!!reviewDeleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setReviewDeleteTarget(null);
            setDeleteReviewError(null);
          }
        }}
        title="후기를 삭제할까요?"
        description={deleteReviewError ?? '삭제하면 되돌릴 수 없어요.'}
        loading={deletingReview}
        onConfirm={handleDeleteReview}
      />

      <ConfirmDialog
        open={!!courseDeleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setCourseDeleteTarget(null);
            setDeleteCourseRecordError(null);
          }
        }}
        title="완주 기록을 삭제할까요?"
        description={deleteCourseRecordError ?? '삭제하면 완주 기록과 통계가 제거됩니다.'}
        loading={deletingCourse}
        onConfirm={handleDeleteCourseRecord}
      />
    </div>
  );
}
