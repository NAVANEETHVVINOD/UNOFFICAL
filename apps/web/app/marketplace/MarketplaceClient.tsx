"use client";

import { useState, useEffect } from "react";
import Container from "../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Staple,
  Tape,
} from "../components/ui/NewspaperUI";
import Doodle from "../components/ui/Doodle";
import { PageTransition } from "../providers/AnimationProvider";
import DashboardNavbar from "../components/ui/DashboardNavbar";
import { motion } from "framer-motion";
import { api } from "../../lib/api";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  status: "ACTIVE" | "SOLD" | "HIDDEN";
  createdAt: string;
  owner: {
    profile: {
      fullName: string;
    };
  };
}

export default function MarketplaceClient() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await api.getMarketplaceListings();
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageTransition>
      <Container>
        <div className="py-8 min-h-screen">
          <DashboardNavbar />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 text-center relative"
          >
            <Doodle
              src="/doodles/shopping-bag.svg"
              className="w-24 h-24 absolute -top-12 left-1/4 -z-10 opacity-20 -rotate-12"
            />
            <h1 className="font-display text-5xl md:text-7xl font-black mb-4">
              MARKETPLACE
            </h1>
            <p className="font-hand text-xl text-gray-600 max-w-2xl mx-auto">
              Buy. Sell. Trade. One student's trash is another's treasure.
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto mb-12 relative"
          >
            <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" />
            <div className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-2">
              <input
                type="text"
                placeholder="Search for books, gadgets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow p-2 font-mono focus:outline-none"
              />
              <RetroButton className="py-2 px-6">FIND</RetroButton>
            </div>
          </motion.div>

          {/* Listings Grid */}
          {loading ? (
            <div className="text-center py-20">
              <Doodle
                src="/doodles/loading.svg"
                className="w-16 h-16 mx-auto animate-spin"
              />
              <p className="font-mono mt-4">Loading items...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link href={`/marketplace/${item.id}`}>
                    <NewspaperCard className="h-full hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group bg-white p-0 overflow-hidden flex flex-col">
                      {/* Image Placeholder */}
                      <div className="h-48 bg-gray-100 border-b-2 border-black flex items-center justify-center relative overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Doodle
                            src="/doodles/camera.svg"
                            className="w-16 h-16 opacity-20"
                          />
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-accent-yellow text-black border-black shadow-sm">
                            ₹{item.price}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="font-bold text-xl mb-2 group-hover:underline decoration-2 decoration-accent-blue line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2 font-body text-sm mb-4 flex-grow">
                          {item.description || "No description available."}
                        </p>

                        <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-200">
                          <span className="font-mono text-xs text-gray-500 truncate max-w-[120px]">
                            By {item.owner.profile.fullName}
                          </span>
                          <span className="font-bold text-xs bg-black text-white px-2 py-1">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </NewspaperCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredListings.length === 0 && (
            <div className="text-center py-20">
              <Doodle
                src="/doodles/sad-face.svg"
                className="w-24 h-24 mx-auto mb-4 opacity-50"
              />
              <h3 className="font-bold text-2xl mb-2">No Items Found</h3>
              <p className="text-gray-600">
                The market is empty. Be the first to sell something!
              </p>
              <div className="mt-6">
                <RetroButton>SELL AN ITEM</RetroButton>
              </div>
            </div>
          )}
        </div>
      </Container>
    </PageTransition>
  );
}
