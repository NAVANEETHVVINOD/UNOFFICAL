"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  Calendar,
  BookOpen,
  ShoppingBag,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface CollegeStats {
  totalClubs: number;
  totalEvents: number;
  totalMembers: number;
  totalNotes: number;
  totalMarketplacePosts?: number;
}

interface CollegeInfoProps {
  college: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    city?: string;
    state?: string;
    logoUrl?: string;
  } | null;
  stats: CollegeStats | null;
  collegeSlug: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CollegeInfo({ college, stats, collegeSlug }: CollegeInfoProps) {
  const quickLinks = [
    {
      label: "Events",
      description: "Campus events & activities",
      icon: Calendar,
      color: "bg-accent-coral",
      href: `/colleges/${collegeSlug}/events`,
    },
    {
      label: "Marketplace",
      description: "Buy & sell with students",
      icon: ShoppingBag,
      color: "bg-primary",
      href: `/colleges/${collegeSlug}/marketplace`,
    },
    {
      label: "Clubs",
      description: "Student organizations",
      icon: Users,
      color: "bg-accent-blue",
      href: `/clubs?college=${collegeSlug}`,
    },
    {
      label: "Notes",
      description: "Study materials",
      icon: BookOpen,
      color: "bg-accent-purple",
      href: `/notes?college=${collegeSlug}`,
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* College Header Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-dark-surface border-2 border-ink dark:border-dark-border rounded-2xl shadow-neo overflow-hidden"
      >
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-br from-primary via-accent-coral to-accent-blue relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-dark-surface to-transparent" />
        </div>

        {/* College Info */}
        <div className="px-6 pb-6 -mt-12 relative">
          {/* Logo/Icon */}
          <div className="w-24 h-24 bg-white dark:bg-dark-surface border-4 border-ink dark:border-dark-border rounded-2xl shadow-neo flex items-center justify-center mb-4">
            {college?.logoUrl ? (
              <img
                src={college.logoUrl}
                alt={college.name}
                className="w-16 h-16 object-contain"
              />
            ) : (
              <Building2 className="w-12 h-12 text-primary" />
            )}
          </div>

          {/* Name & Location */}
          <h1 className="font-display text-3xl md:text-4xl font-black text-ink dark:text-dark-text mb-2">
            {college?.name || collegeSlug.toUpperCase()}
          </h1>

          {(college?.city || college?.state) && (
            <div className="flex items-center gap-2 text-neutral-600 dark:text-dark-text-muted mb-4">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">
                {[college?.city, college?.state].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          {/* Description */}
          {college?.description && (
            <p className="text-neutral-700 dark:text-dark-text-muted leading-relaxed max-w-2xl">
              {college.description}
            </p>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <StatCard
          label="Members"
          value={stats?.totalMembers || 0}
          icon={Users}
          color="bg-accent-blue"
        />
        <StatCard
          label="Clubs"
          value={stats?.totalClubs || 0}
          icon={Sparkles}
          color="bg-accent-coral"
        />
        <StatCard
          label="Events"
          value={stats?.totalEvents || 0}
          icon={Calendar}
          color="bg-primary"
        />
        <StatCard
          label="Notes"
          value={stats?.totalNotes || 0}
          icon={BookOpen}
          color="bg-accent-purple"
        />
      </motion.div>

      {/* Quick Links */}
      <motion.div variants={itemVariants}>
        <h2 className="font-display text-xl font-bold text-ink dark:text-dark-text mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <QuickLinkCard key={link.label} {...link} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-dark-surface border-2 border-ink dark:border-dark-border rounded-xl p-4 shadow-neo-sm">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-2`}>
        <Icon className="w-5 h-5 text-ink" />
      </div>
      <p className="font-display text-2xl font-black text-ink dark:text-dark-text">
        {value.toLocaleString()}
      </p>
      <p className="text-sm text-neutral-500 dark:text-dark-text-muted font-medium">
        {label}
      </p>
    </div>
  );
}

function QuickLinkCard({
  label,
  description,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  description: string;
  icon: typeof Calendar;
  color: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        className="bg-white dark:bg-dark-surface border-2 border-ink dark:border-dark-border rounded-xl p-4 shadow-neo-sm hover:shadow-neo transition-all group cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5 text-ink" />
            </div>
            <div>
              <h3 className="font-bold text-ink dark:text-dark-text group-hover:underline">
                {label}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-dark-text-muted">
                {description}
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-ink dark:group-hover:text-dark-text transition-colors" />
        </div>
      </motion.div>
    </Link>
  );
}
