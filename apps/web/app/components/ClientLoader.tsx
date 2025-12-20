"use client";

import { useState, useEffect } from "react";
import { ModernLoading } from "./ui/ModernLoading";
import { usePathname } from "next/navigation";

export default function ClientLoader() {
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        // Check if we've already shown the loader this session
        const hasLoaded = sessionStorage.getItem("linker_initial_load");

        if (hasLoaded) {
            setLoading(false);
        } else {
            // Show loader for a bit, then dismiss
            const timer = setTimeout(() => {
                setLoading(false);
                sessionStorage.setItem("linker_initial_load", "true");
            }, 3000); // 3 seconds for the "Gas" animation to shine

            return () => clearTimeout(timer);
        }
    }, []);

    if (!loading) return null;

    return <ModernLoading />;
}
