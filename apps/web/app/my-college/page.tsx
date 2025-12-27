"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { api } from "../../lib/api";
import { motion } from "framer-motion";
import { School, AlertCircle } from "lucide-react";

export default function MyCollegeRedirect() {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Wait for auth to load
        if (loading) return;

        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            router.replace("/login?redirect=/my-college");
            return;
        }

        const handleRedirect = async () => {
            // Check if user has a college slug directly
            const collegeSlug = user?.profile?.college?.slug;
            
            // Check for tempCollegeId in socials (could be ID or slug)
            const tempCollegeId = (user?.profile?.socials as any)?.tempCollegeId;
            const tempCollegeSlug = (user?.profile?.socials as any)?.tempCollegeSlug;

            if (collegeSlug) {
                // User has college with slug - redirect directly
                router.replace(`/colleges/${collegeSlug}`);
            } else if (tempCollegeSlug) {
                // User has tempCollegeSlug stored - use it directly
                router.replace(`/colleges/${tempCollegeSlug}`);
            } else if (tempCollegeId) {
                // tempCollegeId might be a slug or an ID, try slug first
                // Check if it looks like a UUID (contains dashes and is long)
                const isUUID = tempCollegeId.includes('-') && tempCollegeId.length > 30;
                
                if (isUUID) {
                    // It's an ID, fetch the college to get slug
                    try {
                        const college = await api.getCollege(tempCollegeId);
                        if (college?.slug) {
                            router.replace(`/colleges/${college.slug}`);
                        } else {
                            router.replace("/dashboard");
                        }
                    } catch (err) {
                        console.error("Failed to fetch college:", err);
                        router.replace("/dashboard");
                    }
                } else {
                    // It's likely a slug, use it directly
                    router.replace(`/colleges/${tempCollegeId}`);
                }
            } else {
                // No college set - redirect to onboarding
                setError("No campus selected");
                setTimeout(() => {
                    router.replace("/onboarding?step=college");
                }, 1500);
            }
        };

        handleRedirect();
    }, [user, loading, isAuthenticated, router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-paper">
                <div className="fixed inset-0 pointer-events-none z-0 bg-halftone opacity-30" />
                <motion.div
                    className="text-center z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <motion.div
                        className="w-16 h-16 mx-auto mb-4 bg-yellow-100 border-2 border-black rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </motion.div>
                    <p className="font-display text-xl mb-2">{error}</p>
                    <p className="font-mono text-sm text-gray-500">Redirecting to setup...</p>
                </motion.div>
            </div>
        );
    }

    // Simple loading - no fancy animation, just redirect
    return null;
}
