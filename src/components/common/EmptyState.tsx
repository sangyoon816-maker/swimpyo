'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  emoji: string;
  title: string;
  desc: string;
  href?: string;
  linkLabel?: string;
}

export default function EmptyState({ emoji, title, desc, href, linkLabel }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 16 }}
        className="w-20 h-20 rounded-full bg-[#EFF5EB] flex items-center justify-center text-4xl mx-auto mb-4"
      >
        {emoji}
      </motion.div>
      <p className="text-[15px] font-semibold text-[#4B5563]">{title}</p>
      <p className="text-sm text-[#9CA3AF] mt-1 mb-5 leading-relaxed whitespace-pre-line">
        {desc}
      </p>
      {href && linkLabel && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 bg-[#5F8D4E] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#5F8D4E]/20"
        >
          {linkLabel}
          <ChevronRight size={15} />
        </Link>
      )}
    </motion.div>
  );
}
