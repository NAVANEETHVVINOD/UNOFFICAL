"use client";

import { ShoppingBag, Star } from "lucide-react";

export default function MarketTinyCard({ listing }: { listing: any }) {
    // Mock fallback
    const item = listing || {
        title: "Vintage Canon AE-1",
        price: "₹12,000",
        seller: "Arjun K.",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
    };

    return (
        <div className="flex bg-paper border-2 border-black shadow-neo hover:shadow-neo-lg transition-all group overflow-hidden h-32 rounded-card-lg">
            {/* Left: Image */}
            <div className="w-32 h-full relative border-r-2 border-black">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-0 left-0 bg-accent-yellow border-b-2 border-r-2 border-black px-2 py-1 font-mono text-xs font-bold">
                    {item.price}
                </div>
            </div>

            {/* Right: Info */}
            <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-gray-500 uppercase mb-1">
                        <ShoppingBag className="w-3 h-3" /> Classified
                    </div>
                    <h3 className="font-display font-bold text-lg leading-tight line-clamp-2">{item.title}</h3>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600 font-medium flex items-center gap-1">
                        <span>@{item.seller}</span>
                        <span className="flex items-center text-orange-500"><Star className="w-3 h-3 fill-current" /> {item.rating}</span>
                    </div>
                    <button className="bg-black text-white text-xs px-3 py-1 font-bold hover:bg-gray-800 transition-colors uppercase">
                        Buy
                    </button>
                </div>
            </div>
        </div>
    );
}
