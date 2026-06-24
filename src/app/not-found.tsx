import EmptyState from '@/components/common/EmptyState';

export default function NotFound() {
  return (
    <div className="px-4 pt-20">
      <EmptyState
        emoji="🍃"
        title="페이지를 찾을 수 없어요"
        desc={'주소가 잘못되었거나\n삭제된 페이지예요'}
        href="/"
        linkLabel="홈으로 돌아가기"
      />
    </div>
  );
}
