"use client";

import { useState, useEffect, use } from "react";
import {
  NewspaperCard,
  RetroButton,
  Badge,
} from "../../../components/ui/NewspaperUI";
import Doodle from "../../../components/ui/Doodle";
import { motion } from "framer-motion";
import Link from "next/link";
import { api } from "../../../../lib/api";
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
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const { slug } = use(params);
  const { user } = useAuth();

  useEffect(() => {
    fetchClubs();
  }, [slug]);

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

  const canCreateClub =
    user?.role === "COLLEGE_ADMIN" || user?.role === "PLATFORM_ADMIN";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12 flex justify-between items-end"
      >
        <div>
          <h1 className="font-display text-4xl md:text-6xl font-black mb-2">
            STUDENT CLUBS
          </h1>
          <p className="font-serif text-xl text-gray-600">
            Find your tribe at {slug.replace(/-/g, " ").toUpperCase()}
          </p>
        </div>
        {canCreateClub && (
          <Link href={`/colleges/${slug}/clubs/create`}>
            <RetroButton className="bg-black text-white hover:bg-accent-pink hover:text-black">
              + START A CLUB
            </RetroButton>
          </Link>
        )}
      </motion.div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="text-center py-20">
          <Doodle
            src="/doodles/loading.svg"
            className="w-16 h-16 mx-auto animate-spin"
          />
          <p className="font-mono mt-4">Loading clubs...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={`/clubs/${club.id}`}>
                <NewspaperCard className="h-full hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group bg-white p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gray-100 border-2 border-black rounded-full overflow-hidden">
                      <img
                        src={
                          club.logoUrl ||
                          `https://api.dicebear.com/7.x/identicon/svg?seed=${club.name}`
                        }
                        alt={club.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Badge className="bg-accent-purple text-white border-black text-[10px]">
                      {club.category || "GENERAL"}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-2xl mb-2 group-hover:underline decoration-2 decoration-accent-purple">
                    {club.name}
                  </h3>
                  <p className="text-gray-600 font-serif text-sm mb-4 flex-grow line-clamp-3">
                    {club.description || "No description available."}
                  </p>

                  <div className="border-t-2 border-dashed border-gray-200 pt-4 flex justify-between items-center mt-auto">
                    <span className="font-mono text-xs text-gray-500">
                      {club._count?.members || 0} Members
                    </span>
                    <span className="font-bold text-sm text-accent-purple group-hover:translate-x-1 transition-transform">
                      VIEW CLUB -&gt;
                    </span>
                  </div>
                </NewspaperCard>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && clubs.length === 0 && (
        <div className="text-center py-20">
          <Doodle
            src="/doodles/sad-face.svg"
            className="w-24 h-24 mx-auto mb-4 opacity-50"
          />
          <h3 className="font-bold text-2xl mb-2">No Clubs Found</h3>
          <p className="text-gray-600">Be the first to start a revolution!</p>
        </div>
      )}
    </div>
  );
}
