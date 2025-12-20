"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";
import { Calendar, Sparkles, Users, Plus, Home } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

interface Club {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  category: string;
  _count?: {
    members: number;
  };
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CollegeClubsPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const { user } = useAuth();

  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const data = await api.getClubs(slug);
        setClubs(data);
      } catch (error) {
        console.error("Failed to fetch clubs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, [slug]);

  const canCreateClub =
    user?.role === "COLLEGE_ADMIN" || user?.role === "PLATFORM_ADMIN";

  return (
    <motion.div
      className="min-h-screen bg-paper dark:bg-dark-bg relative transition-colors duration-300 pb-20 pt-24 md:pt-36 px-4 lg:px-6 max-w-[1400px] mx-auto"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) {
          // Swipe Right -> Events
          router.push(`/colleges/${slug}/events`);
        }
      }}
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 top-16 md:top-20">
        <div className="absolute inset-0 opacity-40 bg-grid dark:opacity-20" />
      </div>

      {/* Local Navigation Tabs */}
      <div className="flex items-center justify-between gap-2 mb-6 relative z-10">
        {[
          { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
          { id: 'feed', label: 'Feed', icon: Sparkles, path: `/colleges/${slug}` },
          { id: 'events', label: 'Events', icon: Calendar, path: `/colleges/${slug}/events` },
          { id: 'clubs', label: 'Clubs', icon: Users, path: `/colleges/${slug}/clubs` }
        ].map((tab) => (
          <Link key={tab.id} href={tab.path} className="flex-1">
            <div className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all ${tab.id === 'clubs'
              ? 'bg-accent-orange text-ink border-ink shadow-neo-sm'
              : 'bg-paper border-ink/10 hover:border-ink/30 hover:bg-neutral-50'
              }`}>
              <tab.icon className="w-4 h-4" />
              <span className={`font-display font-bold text-sm uppercase tracking-wide ${tab.id === 'clubs' ? 'text-ink' : 'text-neutral-500'} hidden sm:inline`}>
                {tab.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Header & Action */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-3xl font-black text-ink">Student Clubs</h1>
          <p className="text-neutral-500">Discover and join communities.</p>
        </div>
        {canCreateClub && (
          <Link href={`/colleges/${slug}/clubs/create`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-neutral-800 transition-colors shadow-neo-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Start Club</span>
            </button>
          </Link>
        )}
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-paper rounded-xl border-2 border-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : clubs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <Link key={club.id} href={`/clubs/${club.id}`}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-paper border-2 border-ink rounded-xl p-6 shadow-neo hover:shadow-neo-lg transition-all cursor-pointer h-full flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-neutral-100 border-2 border-ink rounded-xl overflow-hidden">
                    <img
                      src={club.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${club.name}`}
                      alt={club.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-2 py-1 bg-accent-purple/20 text-accent-purple border border-accent-purple rounded text-[10px] font-bold uppercase">
                    {club.category}
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl mb-2">{club.name}</h3>
                <p className="text-sm text-neutral-500 line-clamp-2 mb-4 flex-grow">
                  {club.description || "No description available."}
                </p>

                <div className="pt-4 border-t border-neutral-200 flex justify-between items-center text-xs font-mono text-neutral-500">
                  <span>{club._count?.members || 0} Members</span>
                  <span className="text-ink font-bold group-hover:underline">View Details →</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-paper rounded-xl border-2 border-dashed border-neutral-300">
          <Users className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
          <h3 className="font-bold text-lg text-neutral-600">No Clubs Found</h3>
          <p className="text-neutral-400 text-sm">Be the first to create one!</p>
        </div>
      )}
    </motion.div>
  );
}
