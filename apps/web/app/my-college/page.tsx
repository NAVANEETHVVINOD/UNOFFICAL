"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function MyCollegeRedirect() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user?.profile?.college?.slug) {
                router.replace(`/colleges/${user.profile.college.slug}`);
            } else {
                router.replace("/dashboard");
            }
        }
    }, [user, loading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-paper">
            <div className="animate-pulse font-display text-xl">WARPING TO CAMPUS...</div>
        </div>
    );
}
