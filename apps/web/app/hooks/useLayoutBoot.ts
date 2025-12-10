"use client";

import { useEffect, useState } from "react";

export function useLayoutBoot() {
    const [isBooted, setIsBooted] = useState(false);

    useEffect(() => {
        // Simulate layout pre-calculation or font loading
        const timer = setTimeout(() => {
            setIsBooted(true);
        }, 50); // Small delay to allow initial paint stability

        return () => clearTimeout(timer);
    }, []);

    return { isBooted };
}
