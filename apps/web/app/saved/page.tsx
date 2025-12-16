"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Container from "../components/ui/Container";
import DashboardNavbar from "../components/ui/DashboardNavbar";
import { NewspaperCard, Badge, RetroButton, Tape } from "../components/ui/NewspaperUI";
import { PageTransition } from "../providers/AnimationProvider";
import { ErrorBoundary, LoadingState } from "../components/ErrorBoundary";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../lib/animations";
import { Bookmark, FileText, Calendar, ShoppingBag, BookOpen, Trash2, ExternalLink, Filter } from "lucide-react";
import Link from "next/link";

type SavedItemType = "post" | "event" | "listing" | "note";

interface SavedItem {
  id: string;
  type: SavedItemType;
  savedAt: string;
  item: {
    id: string;
    title?: string;
    content?: string;
    imageUrl?: string;
    price?: number;
    startsAt?: string;
    isDeleted?: boolean;
  };
}

function SavedContent() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SavedItemType | "all">("all");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router, authLoading]);

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/saved");
      if (res.ok) {
        const data = await res.json();
        setSavedItems(data);
      } else {
        // Mock data
        setSavedItems(generateMockSaved());
      }
    } catch (error) {
      console.error("Failed to fetch saved items:", error);
      setSavedItems(generateMockSaved());
    } finally {
      setLoading(false);
    }
  };

  const generateMockSaved = (): SavedItem[] => {
    return [
      { id: "s1", type: "post", savedAt: new Date().toISOString(), item: { id: "p1", content: "Just finished my final project! So relieved 😅 #campuslife", imageUrl: undefined } },
      { id: "s2", type: "event", savedAt: new Date(Date.now() - 86400000).toISOString(), item: { id: "e1", title: "Tech Talk: AI in 2025", startsAt: new Date(Date.now() + 86400000 * 3).toISOString() } },
      { id: "s3", type: "listing", savedAt: new Date(Date.now() - 86400000 * 2).toISOString(), item: { id: "l1", title: "MacBook Pro 2023", price: 45000, imageUrl: undefined } },
      { id: "s4", type: "note", savedAt: new Date(Date.now() - 86400000 * 3).toISOString(), item: { id: "n1", title: "Data Structures Complete Notes" } },
      { id: "s5", type: "post", savedAt: new Date(Date.now() - 86400000 * 5).toISOString(), item: { id: "p2", content: "This content is no longer available", isDeleted: true } },
    ];
  };

  const handleRemove = async (savedId: string) => {
    try {
      await fetch(`/api/saved/${savedId}`, { method: "DELETE" });
    } catch (error) {
      console.error("Failed to remove:", error);
    }
    
    setSavedItems(prev => prev.filter(item => item.id !== savedId));
  };

  const getTypeIcon = (type: SavedItemType) => {
    switch (type) {
      case "post": return <FileText className="w-4 h-4" />;
      case "event": return <Calendar className="w-4 h-4" />;
      case "listing": return <ShoppingBag className="w-4 h-4" />;
      case "note": return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: SavedItemType) => {
    switch (type) {
      case "post": return "bg-blue-100 text-blue-700 border-blue-300";
      case "event": return "bg-purple-100 text-purple-700 border-purple-300";
      case "listing": return "bg-green-100 text-green-700 border-green-300";
      case "note": return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  const getItemLink = (item: SavedItem) => {
    switch (item.type) {
      case "post": return `/posts/${item.item.id}`;
      case "event": return `/events/${item.item.id}`;
      case "listing": return `/marketplace/${item.item.id}`;
      case "note": return `/notes/${item.item.id}`;
    }
  };

  const filteredItems = filter === "all" 
    ? savedItems 
    : savedItems.filter(item => item.type === filter);

  if (authLoading) return <LoadingState />;
  if (!isAuthenticated) return null;

  const counts = {
    all: savedItems.length,
    post: savedItems.filter(i => i.type === "post").length,
    event: savedItems.filter(i => i.type === "event").length,
    listing: savedItems.filter(i => i.type === "listing").length,
    note: savedItems.filter(i => i.type === "note").length,
  };

  return (
    <PageTransition>
      <Container>
        <div className="py-8 min-h-screen">
          <DashboardNavbar />

          <div className="max-w-3xl mx-auto mt-12 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-4xl md:text-5xl font-black uppercase flex items-center gap-3">
                <Bookmark className="w-10 h-10" />
                Saved Items
              </h1>
              <p className="font-mono text-gray-500 mt-2">Your bookmarked content</p>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-2"
            >
              {(["all", "post", "event", "listing", "note"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`flex items-center gap-2 px-4 py-2 font-bold text-sm border-2 border-black transition-all ${
                    filter === type ? "bg-black text-white" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {type === "all" ? <Filter className="w-4 h-4" /> : getTypeIcon(type)}
                  <span className="capitalize">{type === "all" ? "All" : `${type}s`}</span>
                  <span className="text-xs opacity-70">({counts[type]})</span>
                </button>
              ))}
            </motion.div>

            {/* Saved Items List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-gray-100 animate-pulse border-2 border-gray-200" />
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredItems.map((saved) => (
                  <motion.div key={saved.id} variants={itemVariants}>
                    <NewspaperCard className={`p-4 border-2 ${saved.item.isDeleted ? "opacity-60 bg-gray-50" : "hover:shadow-neo"} transition-shadow`}>
                      <div className="flex items-start gap-4">
                        {/* Type Badge */}
                        <Badge className={`${getTypeColor(saved.type)} flex items-center gap-1`}>
                          {getTypeIcon(saved.type)}
                          <span className="capitalize">{saved.type}</span>
                        </Badge>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {saved.item.isDeleted ? (
                            <p className="text-gray-500 italic">Content no longer available</p>
                          ) : (
                            <>
                              {saved.item.title && (
                                <h3 className="font-bold text-lg truncate">{saved.item.title}</h3>
                              )}
                              {saved.item.content && (
                                <p className="text-gray-600 line-clamp-2">{saved.item.content}</p>
                              )}
                              {saved.item.price && (
                                <p className="font-mono font-bold text-green-600">₹{saved.item.price.toLocaleString()}</p>
                              )}
                              {saved.item.startsAt && (
                                <p className="text-sm text-gray-500 font-mono">
                                  {new Date(saved.item.startsAt).toLocaleDateString()}
                                </p>
                              )}
                            </>
                          )}
                          <p className="text-xs text-gray-400 font-mono mt-2">
                            Saved {new Date(saved.savedAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!saved.item.isDeleted && (
                            <Link href={getItemLink(saved)}>
                              <button className="p-2 border-2 border-black bg-white hover:bg-gray-50 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </Link>
                          )}
                          <button
                            onClick={() => handleRemove(saved.id)}
                            className="p-2 border-2 border-black bg-white hover:bg-red-50 hover:border-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </NewspaperCard>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <NewspaperCard className="p-12 text-center border-4">
                <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h2 className="font-display text-2xl font-black mb-2">No Saved Items</h2>
                <p className="text-gray-500 mb-6">
                  {filter === "all" 
                    ? "Start saving posts, events, and listings to find them here!"
                    : `No saved ${filter}s yet.`}
                </p>
                <Link href="/dashboard">
                  <RetroButton className="bg-accent-blue text-white border-black">
                    Explore Feed
                  </RetroButton>
                </Link>
              </NewspaperCard>
            )}
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}

export default function SavedPage() {
  return (
    <ErrorBoundary>
      <SavedContent />
    </ErrorBoundary>
  );
}
