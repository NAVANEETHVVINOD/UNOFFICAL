"use client";

import { motion } from "framer-motion";
import { TrendingUp, Hash, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const trendingTopics = [
  { tag: "CampusFest2024", posts: 234, trending: true },
  { tag: "ExamSeason", posts: 189, trending: true },
  { tag: "ClubRecruitment", posts: 156, trending: false },
  { tag: "StudyGroup", posts: 98, trending: false },
  { tag: "Internships", posts: 87, trending: true },
];

export default function TrendingWidget() {
  return (
    <motion.div
      className="bg-white border-2 border-ink shadow-neo overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-primary/10 border-b border-ink/10 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        <h3 className="font-display text-sm uppercase tracking-wide">Trending</h3>
      </div>

      {/* Topics List */}
      <div className="divide-y divide-neutral-100">
        {trendingTopics.map((topic, index) => (
          <motion.div
            key={topic.tag}
            className="px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-neutral-400" />
                <span className="font-medium text-sm group-hover:text-primary transition-colors">
                  {topic.tag}
                </span>
                {topic.trending && (
                  <span className="px-1.5 py-0.5 bg-accent-coral/20 text-accent-coral text-[10px] font-bold rounded">
                    HOT
                  </span>
                )}
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-xs text-neutral-500 mt-1 ml-6">
              {topic.posts} posts
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <Link href="/explore" className="block">
        <div className="px-4 py-3 bg-neutral-50 text-center hover:bg-neutral-100 transition-colors">
          <span className="text-sm font-medium text-ink">
            Explore More →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
