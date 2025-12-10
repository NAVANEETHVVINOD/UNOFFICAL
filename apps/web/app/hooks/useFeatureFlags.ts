"use client";

import { useEffect, useState } from "react";

type FeatureFlags = {
    marketplace: boolean;
    polls: boolean;
    collabs: boolean;
    crtMode: boolean;
    newFeed: boolean;
};

const defaultFlags: FeatureFlags = {
    marketplace: true,
    polls: true,
    collabs: false, // Disabled per plan
    crtMode: true,
    newFeed: true,
};

export function useFeatureFlags() {
    const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);

    useEffect(() => {
        // In the future, this could fetch from a remote config or env vars
        // const envFlags = process.env.NEXT_PUBLIC_FEATURE_FLAGS;
        setFlags(defaultFlags);
    }, []);

    return flags;
}
