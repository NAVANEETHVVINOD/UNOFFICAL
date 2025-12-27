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
    const [redirecting, setRedirecting] = useState(false);
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
            // Check if user has a college (check both college.slug and tempCollegeId in socials)
            const collegeSlug = user?.profile?.college?.slug;
            const tempCollegeId = (user?.profile?.socials as any)?.tempCollegeId;

            if (collegeSlug) {
                setRedirecting(true);
                router.replace(`/colleges/${collegeSlug}`);
            } else if (tempCollegeId) {
                // User has a fallback college (tempCollegeId) - fetch the college to get its slug
                setRedirecting(true);
                try {
                    const college = await api.getCollege(tempCollegeId);
                    if (college?.slug) {
                        router.replace(`/colleges/${college.slug}`);
                    } else {
                        // College found but no slug, redirect to dashboard
                        router.replace("/dashboard");
                    }
                } catch (err) {
                    console.error("Failed to fetch college:", err);
                    // Fallback to dashboard if API fails
                    router.replace("/dashboard");
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-paper">
            {/* Background pattern */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-halftone opacity-30" />

            <motion.div
                className="text-center z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {error ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <motion.div
                            className="w-16 h-16 mx-auto mb-4 bg-accent-blue/20 border-2 border-black rounded-full flex items-center justify-center"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <School className="w-8 h-8" />
                        </motion.div>
                        <motion.p
                            className="font-display text-xl"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {redirecting ? "ENTERING CAMPUS..." : "LOADING..."}
                        </motion.p>
                    </>
                )}
            </motion.div>
        </div>
    );
}
