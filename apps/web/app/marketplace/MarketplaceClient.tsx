"use client";

import { useState, useEffect, useMemo } from "react";
import Container from "../components/ui/Container";
import {
  RetroButton,
  Badge,
} from "../components/ui/NewspaperUI";
import { PageTransition } from "../providers/AnimationProvider";
import CategoryRibbon from "../components/CategoryRibbon";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../lib/api";
import Link from "next/link";
import { Search, Plus, Filter, ShoppingBag, User, Grid, List, Briefcase, Store } from "lucide-react";
import { containerVariants, itemVariants, pageVariants, cardHoverVariants } from "../../lib/animations";
import { ListingSkeleton } from "../components/ui/Skeleton";
import FreelanceCard from "../components/marketplace/FreelanceCard";
// Layout & Components
import DashboardLayout from "../components/layouts/DashboardLayout";
import ProfileSidebar from "../components/dashboard/ProfileSidebar";
import QuickActions from "../components/dashboard/QuickActions";
import UpcomingEventsWidget from "../components/dashboard/UpcomingEventsWidget";

interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  status: "ACTIVE" | "SOLD" | "HIDDEN";
  type: "PRODUCT" | "SERVICE" | "JOB";
  category?: string;
  createdAt: string;
  owner: {
    id: string;
    profile: {
      fullName: string;
      avatarUrl?: string;
    };
  };
}

type CategoryFilter = "all" | "books" | "electronics" | "clothing" | "services" | "other";
type SortOption = "newest" | "price-low" | "price-high";
type TabType = "market" | "work";

export default function MarketplaceClient() {
  const [activeTab, setActiveTab] = useState<TabType>("market");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMarketplaceListings();
      // Ensure data is an array and filter out invalid items
      const validListings = Array.isArray(data)
        ? data.filter((item: any) => item && item.id && item.owner?.profile)
        : [];
      setListings(validListings);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      setError("Failed to load listings. Please try again.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let result = listings.filter((item) => item.status === "ACTIVE");

    // Tab Filter
    if (activeTab === "market") {
      result = result.filter(item => item.type === "PRODUCT" || !item.type); // Default to product if undefined
    } else {
      result = result.filter(item => item.type === "SERVICE" || item.type === "JOB");
    }

    // Search filter
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (category !== "all") {
      result = result.filter((item) =>
        item.category?.toLowerCase() === category ||
        item.title.toLowerCase().includes(category)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [listings, search, category, sortBy, activeTab]);

  const formatPrice = (price: number) => {
    if (price === 0) return "FREE";
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout
      leftSidebarContent={
        <>
          <ProfileSidebar />
          <QuickActions />
        </>
      }
      rightSidebarContent={
        <UpcomingEventsWidget />
      }
    >
      <PageTransition>
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          <CategoryRibbon className="mb-6 mt-4" />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="font-display text-3xl md:text-5xl font-black mb-1">
                {activeTab === "market" ? "MARKETPLACE" : "WORK & GIGS"}
              </h1>
              <p className="font-mono text-xs md:text-sm text-gray-600">
                {activeTab === "market"
                  ? "Buy, sell, trade with fellow students"
                  : "Find freelance work or hire talent on campus"}
              </p>
            </div>
            <Link href="/marketplace/create">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 bg-accent-yellow border-2 border-black font-bold shadow-neo hover:shadow-neo-lg transition-all"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                {activeTab === "market" ? "SELL ITEM" : "POST GIG"}
              </motion.button>
            </Link>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b-2 border-black/10 pb-1">
            <button
              onClick={() => setActiveTab("market")}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-all border-b-4 ${activeTab === "market"
                ? "border-primary text-black"
                : "border-transparent text-gray-400 hover:text-black"
                }`}
            >
              <Store className="w-4 h-4" />
              MARKET
            </button>
            <button
              onClick={() => setActiveTab("work")}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-all border-b-4 ${activeTab === "work"
                ? "border-accent-blue text-black"
                : "border-transparent text-gray-400 hover:text-black"
                }`}
            >
              <Briefcase className="w-4 h-4" />
              FREELANCE
            </button>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            {/* Search Bar */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === "market" ? "items" : "gigs"}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 border-2 border-black flex items-center gap-2 font-bold text-sm transition-colors ${showFilters ? "bg-black text-white" : "bg-white hover:bg-gray-50"
                  }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              {activeTab === "market" && (
                <div className="hidden md:flex border-2 border-black">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 ${viewMode === "grid" ? "bg-black text-white" : "bg-white"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 border-l-2 border-black ${viewMode === "list" ? "bg-black text-white" : "bg-white"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Filter Options (Simplified for now, reused existing logic) */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-white border-2 border-black mb-4 space-y-4">
                    {/* Reuse existing filters for now */}
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="px-3 py-2 border-2 border-black font-mono text-sm bg-white"
                      >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Count */}
            <div className="flex justify-between items-center text-sm font-mono text-gray-500">
              <span>{filteredListings.length} results</span>
            </div>
          </motion.div>

          {/* Listings Grid */}
          {loading ? (
            <div className={`grid ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-2" : ""} gap-6`}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ListingSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-bold mb-4">{error}</p>
              <RetroButton onClick={fetchListings}>Try Again</RetroButton>
            </div>
          ) : (
            <motion.div
              className={`grid ${viewMode === "grid" || activeTab === "work" ? "md:grid-cols-2 lg:grid-cols-2" : ""} gap-6`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {filteredListings.map((item) => (
                  activeTab === "work" ? (
                    // Render Freelance Card
                    <FreelanceCard key={item.id} listing={item as any} />
                  ) : (
                    // Render Standard Product Card
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Link href={`/marketplace/${item.id}`}>
                        <motion.div
                          className={`bg-white border-2 border-black shadow-neo overflow-hidden cursor-pointer group ${viewMode === "list" ? "flex" : ""
                            }`}
                          variants={cardHoverVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          {/* Image */}
                          <div className={`bg-gray-100 border-b-2 ${viewMode === "list" ? "w-32 h-32 border-b-0 border-r-2" : "h-48"} border-black flex items-center justify-center relative overflow-hidden`}>
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <ShoppingBag className="w-12 h-12 text-gray-300" />
                            )}
                            {/* Price Badge */}
                            <div className="absolute top-2 right-2">
                              <Badge className={`${item.price === 0 ? "bg-green-400" : "bg-accent-yellow"} text-black border-black shadow-sm font-bold`}>
                                {formatPrice(item.price)}
                              </Badge>
                            </div>
                          </div>

                          {/* Content */}
                          <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-accent-blue transition-colors line-clamp-1">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {item.description || "No description"}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 border border-black overflow-hidden">
                                  {item.owner.profile.avatarUrl ? (
                                    <img src={item.owner.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <User className="w-full h-full p-1 text-gray-400" />
                                  )}
                                </div>
                                <span className="font-mono text-xs text-gray-500 truncate max-w-[100px]">
                                  {item.owner.profile.fullName}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-gray-400">
                                {formatDate(item.createdAt)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredListings.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="mb-4 text-gray-300">
                {activeTab === "market" ? <ShoppingBag className="w-16 h-16 mx-auto" /> : <Briefcase className="w-16 h-16 mx-auto" />}
              </div>
              <h3 className="font-bold text-xl mb-2">No {activeTab === "market" ? "Items" : "Gigs"} Found</h3>
              <p className="text-gray-600 mb-6">
                {search ? "Try adjusting your search or filters" : "Be the first to list something!"}
              </p>
              <div className="flex gap-4 justify-center">
                {search && (
                  <RetroButton variant="outline" onClick={() => setSearch("")}>
                    Clear Search
                  </RetroButton>
                )}
                <Link href="/marketplace/create">
                  <RetroButton>{activeTab === "market" ? "Sell an Item" : "Post a Gig"}</RetroButton>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </PageTransition>
    </DashboardLayout>
  );
}
