"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Container from "../components/ui/Container";
import Navbar from "../components/Navbar";
import BottomNav from "../components/ui/BottomNav";
import { PageTransition } from "../providers/AnimationProvider";
import { FeedSkeleton } from "../components/ui/Skeleton";
import CollaborationCard from "../components/CollaborationCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../../lib/api";
import {
  Users,
  Plus,
  Search,
  Filter,
  X,
  Code,
  Palette,
  Music,
  Camera,
  Briefcase,
  BookOpen,
  Megaphone,
  Wrench,
} from "lucide-react";

// Skill categories for filtering
const SKILL_CATEGORIES = [
  { id: "all", label: "All", icon: Users },
  { id: "development", label: "Development", icon: Code },
  { id: "design", label: "Design", icon: Palette },
  { id: "music", label: "Music", icon: Music },
  { id: "media", label: "Media", icon: Camera },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "academic", label: "Academic", icon: BookOpen },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "other", label: "Other", icon: Wrench },
];

const STATUS_FILTERS = [
  { id: "all", label: "All Status" },
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In Progress" },
  { id: "closed", label: "Closed" },
];

interface Collaboration {
  id: string;
  title: string;
  content: string;
  skills?: string[];
  deadline?: string;
  status?: string;
  author?: {
    id: string;
    profile?: {
      fullName: string;
      avatarUrl?: string;
    };
  };
  createdAt: string;
  _count?: {
    comments: number;
    likes: number;
  };
}

export default function CollaboClient() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCollaborations();
  }, [selectedSkill, selectedStatus]);

  const fetchCollaborations = async () => {
    setIsLoading(true);
    try {
      // Fetch posts with type COLLAB
      const response = await api.getPosts(
        user?.profile?.college?.slug,
        1,
        50,
        "all"
      );
      
      // Filter for collab posts
      const collabPosts = (response.posts || response || []).filter(
        (post: any) => post.type === "COLLAB"
      );
      
      // Apply filters
      let filtered = collabPosts;
      
      if (selectedSkill !== "all") {
        filtered = filtered.filter((c: any) =>
          c.skills?.some((s: string) =>
            s.toLowerCase().includes(selectedSkill.toLowerCase())
          )
        );
      }
      
      if (selectedStatus !== "all") {
        filtered = filtered.filter(
          (c: any) => (c.status || "open").toLowerCase() === selectedStatus
        );
      }
      
      setCollaborations(filtered);
    } catch (error) {
      console.error("Failed to fetch collaborations:", error);
      toast("Failed to load collaborations", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCollaborations = collaborations.filter((collab) =>
    searchQuery
      ? collab.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collab.content?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper dark:bg-dark-bg">
        <Navbar />

        <Container>
          <div className="pt-20 pb-24">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent-mint border-2 border-ink rounded-xl shadow-neo-sm">
                  <Users className="w-8 h-8 text-ink" />
                </div>
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-ink dark:text-dark-text tracking-tight">
                    Collaborations
                  </h1>
                  <p className="font-mono text-sm text-neutral-500 dark:text-dark-text-muted">
                    Find teammates for your next project
                  </p>
                </div>
              </div>

              {isAuthenticated && (
                <button
                  onClick={() => router.push("/collabo/create")}
                  className="btn-neo btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Collab</span>
                </button>
              )}
            </div>

            {/* Search & Filters */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search collaborations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-ink rounded-xl bg-white dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 border-2 border-ink rounded-xl flex items-center gap-2 transition-all ${
                    showFilters
                      ? "bg-ink text-white"
                      : "bg-white dark:bg-dark-surface hover:bg-neutral-100"
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Filters</span>
                </button>
              </div>

              {/* Filter Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white dark:bg-dark-surface border-2 border-ink rounded-xl space-y-4">
                      {/* Skill Filter */}
                      <div>
                        <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">
                          Skills Needed
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {SKILL_CATEGORIES.map((skill) => {
                            const Icon = skill.icon;
                            return (
                              <button
                                key={skill.id}
                                onClick={() => setSelectedSkill(skill.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                                  selectedSkill === skill.id
                                    ? "border-ink bg-accent-mint shadow-neo-sm"
                                    : "border-neutral-200 hover:border-neutral-400"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {skill.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Status Filter */}
                      <div>
                        <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">
                          Status
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_FILTERS.map((status) => (
                            <button
                              key={status.id}
                              onClick={() => setSelectedStatus(status.id)}
                              className={`px-3 py-2 rounded-lg border-2 transition-all ${
                                selectedStatus === status.id
                                  ? "border-ink bg-primary shadow-neo-sm"
                                  : "border-neutral-200 hover:border-neutral-400"
                              }`}
                            >
                              <span className="text-sm font-medium">
                                {status.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Clear Filters */}
                      {(selectedSkill !== "all" ||
                        selectedStatus !== "all") && (
                        <button
                          onClick={() => {
                            setSelectedSkill("all");
                            setSelectedStatus("all");
                          }}
                          className="text-sm text-accent-coral font-medium flex items-center gap-1 hover:underline"
                        >
                          <X className="w-4 h-4" />
                          Clear filters
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Collaborations List */}
            {isLoading ? (
              <FeedSkeleton count={3} />
            ) : filteredCollaborations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-accent-mint/20 border-2 border-dashed border-accent-mint rounded-2xl flex items-center justify-center">
                  <Users className="w-10 h-10 text-accent-mint" />
                </div>
                <h3 className="font-display text-xl text-ink dark:text-dark-text mb-2">
                  No collaborations found
                </h3>
                <p className="text-neutral-500 mb-6">
                  {searchQuery || selectedSkill !== "all" || selectedStatus !== "all"
                    ? "Try adjusting your filters"
                    : "Be the first to post a collaboration request!"}
                </p>
                {isAuthenticated && (
                  <button
                    onClick={() => router.push("/collabo/create")}
                    className="btn-neo btn-primary"
                  >
                    Create Collaboration
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredCollaborations.map((collab, index) => (
                    <motion.div
                      key={collab.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CollaborationCard
                        collaboration={collab}
                        onRespond={() => {
                          toast("Response sent!", "success");
                          // In a real implementation, this would open a modal or navigate
                        }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </Container>

        <BottomNav />
      </div>
    </PageTransition>
  );
}
