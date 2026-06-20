import PageHeader from '@/components/layout/PageHeader';
import MypageClient from './MypageClient';

export default function MypagePage() {
  return (
    <div>
      <PageHeader title="마이" showBack={false} />
      <MypageClient />
    </div>
  );
}
