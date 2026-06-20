import PageHeader from '@/components/layout/PageHeader';
import RecordClient from './RecordClient';

export default function RecordPage() {
  return (
    <div>
      <PageHeader title="마음 기록" showBack={false} />
      <RecordClient />
    </div>
  );
}
