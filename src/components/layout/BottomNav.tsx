'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Navigation, BookHeart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/places', icon: MapPin, label: '장소' },
  { href: '/courses', icon: Navigation, label: '코스' },
  { href: '/record', icon: BookHeart, label: '기록' },
  { href: '/mypage', icon: User, label: '마이' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E8E4DD] max-w-[430px] mx-auto">
      <div className="flex items-center justify-around px-2 py-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 flex-1 py-1 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#5F8D4E]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.7}
                className={cn(
                  'transition-colors duration-200',
                  isActive ? 'text-[#5F8D4E]' : 'text-[#9CA3AF]'
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors duration-200',
                  isActive ? 'text-[#5F8D4E]' : 'text-[#9CA3AF]'
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
