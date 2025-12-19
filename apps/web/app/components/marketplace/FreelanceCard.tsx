import { motion } from "framer-motion";
import { Clock, DollarSign, Briefcase, User, ExternalLink } from "lucide-react";
import Link from "next/link";

interface FreelanceListing {
    id: string;
    title: string;
    description: string | null;
    price: number;
    type: "SERVICE" | "JOB";
    category: string;
    owner: {
        id: string;
        profile?: {
            fullName: string;
            avatarUrl?: string;
        };
    };
    createdAt: string;
}

export default function FreelanceCard({ listing }: { listing: FreelanceListing }) {
    const isJob = listing.type === "JOB";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className={`group relative bg-white border-2 border-ink rounded-xl overflow-hidden shadow-neo hover:shadow-neo-lg transition-all ${isJob ? "hover:border-accent-blue" : "hover:border-primary"
                }`}
        >
            {/* Badge */}
            <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-black uppercase tracking-wide border-2 border-ink rounded-full ${isJob ? "bg-accent-blue text-white" : "bg-primary text-ink"
                }`}>
                {isJob ? "Hiring" : "For Hire"}
            </div>

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full border-2 border-ink bg-gray-100 overflow-hidden shrink-0">
                        {listing.owner.profile?.avatarUrl ? (
                            <img
                                src={listing.owner.profile.avatarUrl}
                                alt={listing.owner.profile.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-display text-xl font-bold leading-tight line-clamp-2 group-hover:text-ink/80 transition-colors">
                            {listing.title}
                        </h3>
                        <p className="text-xs text-neutral-500 font-mono mt-1">
                            {listing.owner.profile?.fullName || "Anonymous"}
                        </p>
                    </div>
                </div>

                {/* Details tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1 px-2 py-1 bg-neutral-100 border border-neutral-200 rounded text-xs font-medium">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        <span>{listing.price > 0 ? `₹${listing.price}` : "Negotiable"}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-neutral-100 border border-neutral-200 rounded text-xs font-medium">
                        <Briefcase className="w-3 h-3 text-neutral-500" />
                        <span>{listing.category}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-neutral-100 border border-neutral-200 rounded text-xs font-medium">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-600 line-clamp-3 mb-6">
                    {listing.description}
                </p>

                {/* Footer Action */}
                <div className="flex items-center justify-between mt-auto">
                    <Link href={`/marketplace/${listing.id}`} className="w-full">
                        <button className={`w-full py-2 px-4 border-2 border-ink font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${isJob
                                ? "bg-white hover:bg-black hover:text-white"
                                : "bg-white hover:bg-primary hover:text-ink"
                            }`}>
                            <span>View Details</span>
                            <ExternalLink className="w-3 h-3" />
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
