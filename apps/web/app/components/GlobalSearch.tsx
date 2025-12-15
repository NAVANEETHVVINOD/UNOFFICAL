"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, User, Calendar, ShoppingBag, Users, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { modalVariants } from "../../lib/animations";

interface SearchResult {
  id: string;
  type: "user" | "event" | "listing" | "club" | "post";
  title: string;
  subtitle?: string;
  imageUrl?: string;
  url: string;
}

interface GroupedResults {
  users: SearchResult[];
  events: SearchResult[];
  listings: SearchResult[];
  clubs: SearchResult[];
  posts: SearchResult[];
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const RESULT_ICONS = {
  user: User,
  event: Calendar,
  listing: ShoppingBag,
  club: Users,
  post: FileText,
};

const RESULT_COLORS = {
  user: "bg-accent-blue",
  event: "bg-accent-yellow",
  listing: "bg-accent-pink",
  club: "bg-green-500",
  post: "bg-gray-500",
};

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GroupedResults>({
    users: [],
    events: [],
    listings: [],
    clubs: [],
    posts: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults({ users: [], events: [], listings: [], clubs: [], posts: [] });
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, getTotalResults() - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const result = getResultAtIndex(selectedIndex);
        if (result) {
          navigateToResult(result);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, results]);

  const getTotalResults = () => {
    return (
      results.users.length +
      results.events.length +
      results.listings.length +
      results.clubs.length +
      results.posts.length
    );
  };

  const getResultAtIndex = (index: number): SearchResult | null => {
    const allResults = [
      ...results.users,
      ...results.events,
      ...results.listings,
      ...results.clubs,
      ...results.posts,
    ];
    return allResults[index] || null;
  };

  const navigateToResult = (result: SearchResult) => {
    router.push(result.url);
    onClose();
  };

  // Debounced search
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    setSelectedIndex(0);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchQuery.trim()) {
      setResults({ users: [], events: [], listings: [], clubs: [], posts: [] });
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Parallel search across different endpoints
        const [eventsData, listingsData, clubsData] = await Promise.allSettled([
          api.getEvents(),
          api.getMarketplaceListings(searchQuery),
          api.getClubs(),
        ]);

        const q = searchQuery.toLowerCase();

        // Filter events
        const events: SearchResult[] = [];
        if (eventsData.status === "fulfilled") {
          eventsData.value
            .filter((e: any) => e.title?.toLowerCase().includes(q))
            .slice(0, 5)
            .forEach((e: any) => {
              events.push({
                id: e.id,
                type: "event",
                title: e.title,
                subtitle: new Date(e.startsAt).toLocaleDateString(),
                url: `/events/${e.id}`,
              });
            });
        }

        // Filter listings
        const listings: SearchResult[] = [];
        if (listingsData.status === "fulfilled") {
          listingsData.value
            .slice(0, 5)
            .forEach((l: any) => {
              listings.push({
                id: l.id,
                type: "listing",
                title: l.title,
                subtitle: `₹${l.price}`,
                imageUrl: l.imageUrl,
                url: `/marketplace/${l.id}`,
              });
            });
        }

        // Filter clubs
        const clubs: SearchResult[] = [];
        if (clubsData.status === "fulfilled") {
          clubsData.value
            .filter((c: any) => c.name?.toLowerCase().includes(q))
            .slice(0, 5)
            .forEach((c: any) => {
              clubs.push({
                id: c.id,
                type: "club",
                title: c.name,
                subtitle: c.description?.slice(0, 50),
                url: `/clubs/${c.id}`,
              });
            });
        }

        setResults({
          users: [],
          events,
          listings,
          clubs,
          posts: [],
        });
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  if (!isOpen) return null;

  let currentIndex = 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Search Modal */}
        <motion.div
          className="relative w-full max-w-2xl mx-4 bg-white border-4 border-black shadow-neo-lg overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b-2 border-black">
            <Search className="w-6 h-6 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search events, clubs, marketplace..."
              className="flex-1 text-lg font-medium outline-none placeholder:text-gray-400"
            />
            {loading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {getTotalResults() === 0 && query && !loading && (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-bold">No results found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            )}

            {!query && (
              <div className="p-8 text-center text-gray-500">
                <p className="font-mono text-sm">Start typing to search...</p>
                <div className="mt-4 flex justify-center gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-gray-100 text-xs font-mono rounded">↑↓ Navigate</span>
                  <span className="px-2 py-1 bg-gray-100 text-xs font-mono rounded">↵ Select</span>
                  <span className="px-2 py-1 bg-gray-100 text-xs font-mono rounded">Esc Close</span>
                </div>
              </div>
            )}

            {/* Events */}
            {results.events.length > 0 && (
              <ResultSection
                title="Events"
                results={results.events}
                startIndex={currentIndex}
                selectedIndex={selectedIndex}
                onSelect={navigateToResult}
              />
            )}
            {(currentIndex += results.events.length) && null}

            {/* Clubs */}
            {results.clubs.length > 0 && (
              <ResultSection
                title="Clubs"
                results={results.clubs}
                startIndex={currentIndex}
                selectedIndex={selectedIndex}
                onSelect={navigateToResult}
              />
            )}
            {(currentIndex += results.clubs.length) && null}

            {/* Marketplace */}
            {results.listings.length > 0 && (
              <ResultSection
                title="Marketplace"
                results={results.listings}
                startIndex={currentIndex}
                selectedIndex={selectedIndex}
                onSelect={navigateToResult}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface ResultSectionProps {
  title: string;
  results: SearchResult[];
  startIndex: number;
  selectedIndex: number;
  onSelect: (result: SearchResult) => void;
}

function ResultSection({ title, results, startIndex, selectedIndex, onSelect }: ResultSectionProps) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="px-4 py-2 bg-gray-50 font-bold text-xs uppercase tracking-wider text-gray-500">
        {title}
      </div>
      {results.map((result, i) => {
        const Icon = RESULT_ICONS[result.type];
        const colorClass = RESULT_COLORS[result.type];
        const isSelected = startIndex + i === selectedIndex;

        return (
          <motion.button
            key={result.id}
            onClick={() => onSelect(result)}
            className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
              isSelected ? "bg-accent-yellow/20" : "hover:bg-gray-50"
            }`}
            whileHover={{ x: 4 }}
          >
            <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center text-white`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{result.title}</p>
              {result.subtitle && (
                <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
              )}
            </div>
            {isSelected && (
              <span className="text-xs font-mono text-gray-400">↵</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
