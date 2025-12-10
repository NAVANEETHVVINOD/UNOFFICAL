"use client";

import { useAuth } from "../../context/AuthContext";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MarketplaceRail() {
    const { loading } = useAuth();
    // Mock Data (Replace with API later)
    const trendingItems = [
        { id: 1, title: "Vintage Cam", price: "₹4,500", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80" },
        { id: 2, title: "Engg Books", price: "₹800", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80" },
        { id: 3, title: "Drafting Table", price: "₹2,200", img: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=300&q=80" },
    ];

    if (loading) return <RailSkeleton />;

    return (
        <div className="border-card border-black bg-white p-4 shadow-neo relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-black text-lg flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    MARKET
                </h3>
                <Link href="/marketplace" className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1">
                    VIEW ALL <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            {trendingItems.length > 0 ? (
                <div className="space-y-4">
                    {trendingItems.map((item, i) => (
                        <div key={item.id} className="group relative cursor-pointer transform hover:-translate-y-1 transition-transform">
                            <div className="aspect-[4/3] w-full bg-gray-100 border-2 border-black overflow-hidden relative">
                                <img src={item.img} alt={item.title} className="object-cover w-full h-full" />
                                <div className="absolute bottom-0 right-0 bg-accent-yellow border-t-2 border-l-2 border-black px-2 py-0.5 font-mono text-xs font-bold">
                                    {item.price}
                                </div>
                            </div>
                            <div className="mt-1">
                                <p className="font-bold text-sm truncate group-hover:underline decoration-2">{item.title}</p>
                            </div>
                            {/* Tape */}
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-red-500/80 rotate-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState />
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-8 opacity-60">
            <div className="border-2 border-dashed border-gray-400 p-4 rounded-lg transform rotate-2">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="font-hand text-lg">No chaos for sale...</p>
            </div>
        </div>
    )
}

function RailSkeleton() {
    return (
        <div className="border-2 border-black bg-white p-4 h-64 animate-pulse">
            <div className="h-6 bg-gray-200 w-1/2 mb-4"></div>
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-[4/3] bg-gray-200 border-2 border-gray-100"></div>
                ))}
            </div>
        </div>
    )
}
