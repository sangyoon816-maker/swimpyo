import HomeHero from '@/components/home/HomeHero';
import EmotionSelector from '@/components/home/EmotionSelector';
import NearbySection from '@/components/home/NearbySection';
import PopularSection from '@/components/home/PopularSection';
import CourseBanner from '@/components/home/CourseBanner';

export default function HomePage() {
  return (
    <div>
      <HomeHero />
      <EmotionSelector />
      <div className="h-2 bg-[#F0EDE8]" />
      <NearbySection />
      <div className="h-2 bg-[#F0EDE8]" />
      <CourseBanner />
      <div className="h-2 bg-[#F0EDE8]" />
      <PopularSection />
    </div>
  );
}
