"use client";

import { useState, useEffect, use } from "react";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Sticker,
} from "../../../components/ui/NewspaperUI";
import Doodle from "../../../components/ui/Doodle";
import { motion } from "framer-motion";
import Link from "next/link";
import { api } from "../../../../lib/api";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  seller: {
    profile: {
      fullName: string;
    };
  };
  createdAt: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CollegeMarketplacePage({ params }: PageProps) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { slug } = use(params);

  useEffect(() => {
    fetchItems();
  }, [slug]);

  const fetchItems = async () => {
    try {
      const data = await api.getMarketplaceListings("", slug);
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

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
            MARKETPLACE
          </h1>
          <p className="font-serif text-xl text-gray-600">
            Buy, sell, and trade at {slug.replace(/-/g, " ").toUpperCase()}
          </p>
        </div>
        <Link href={`/colleges/${slug}/marketplace/create`}>
          <RetroButton className="bg-black text-white hover:bg-accent-green hover:text-black">
            + SELL ITEM
          </RetroButton>
        </Link>
      </motion.div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-20">
          <Doodle
            src="/doodles/loading.svg"
            className="w-16 h-16 mx-auto animate-spin"
          />
          <p className="font-mono mt-4">Loading items...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={`/marketplace/${item.id}`}>
                <NewspaperCard className="h-full hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group bg-white p-0 overflow-hidden flex flex-col relative">
                  {/* Price Tag */}
                  <Sticker
                    className="top-2 right-2 bg-accent-green text-black font-bold z-10"
                    rotate={5}
                  >
                    ${item.price}
                  </Sticker>

                  {/* Image */}
                  <div className="h-48 bg-gray-200 border-b-2 border-black relative overflow-hidden">
                    {item.images[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Doodle
                          src="/doodles/shopping-bag.svg"
                          className="w-12 h-12 opacity-20"
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-1 leading-tight group-hover:underline decoration-2 decoration-accent-green line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-mono text-gray-500 mb-2">
                      Sold by {item.seller.profile.fullName}
                    </p>
                    <p className="text-gray-600 font-serif text-sm mb-4 line-clamp-2 flex-grow">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-bold text-xs text-accent-green">
                        DETAILS &gt;
                      </span>
                    </div>
                  </div>
                </NewspaperCard>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-20">
          <Doodle
            src="/doodles/sad-face.svg"
            className="w-24 h-24 mx-auto mb-4 opacity-50"
          />
          <h3 className="font-bold text-2xl mb-2">No Items Found</h3>
          <p className="text-gray-600">
            The market is empty. Time to declutter?
          </p>
        </div>
      )}
    </div>
  );
}
