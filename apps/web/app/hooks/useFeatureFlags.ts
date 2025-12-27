"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Feature Flags for LINKER
 * Controls feature availability for controlled rollout
 * 
 * TWA Launch Configuration:
 * - Enabled: feed, eventsView, chat, marketplace (limited)
 * - Disabled: communities, classroom, collab, eventsCreate (non-admin)
 */
export type FeatureFlags = {
    // Core features
    feed: boolean;
    eventsView: boolean;
    eventsCreate: boolean;
    chat: boolean;
    marketplace: boolean;
    
    // Advanced features (disabled for launch)
    communities: boolean;
    classroom: boolean;
    collab: boolean;
    
    // UI features
    polls: boolean;
    crtMode: boolean;
    newFeed: boolean;
};

// Features that admins can always access regardless of flags
export const ADMIN_OVERRIDE_FEATURES: (keyof FeatureFlags)[] = [
    'eventsCreate',
    'communities',
    'classroom',
];

// Default launch configuration for TWA
const defaultFlags: FeatureFlags = {
    // Enabled for launch
    feed: true,
    eventsView: true,
    chat: true,
    marketplace: true,
    polls: true,
    crtMode: true,
    newFeed: true,
    
    // Disabled for launch (controlled rollout)
    eventsCreate: false,  // Admin only
    communities: false,
    classroom: false,
    collab: false,
};

/**
 * Check if a feature is enabled
 * @param flags Current feature flags
 * @param feature Feature to check
 * @param isAdmin Whether the user is an admin
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled(
    flags: FeatureFlags,
    feature: keyof FeatureFlags,
    isAdmin: boolean = false
): boolean {
    // Admin override check
    if (isAdmin && ADMIN_OVERRIDE_FEATURES.includes(feature)) {
        return true;
    }
    return flags[feature];
}

/**
 * Check if user has admin access for a feature
 * @param feature Feature to check
 * @param userRole User's role
 * @returns Whether user has admin access
 */
export function hasAdminAccess(
    feature: keyof FeatureFlags,
    userRole?: string
): boolean {
    const adminRoles = ['COLLEGE_ADMIN', 'PLATFORM_ADMIN', 'CLUB_ADMIN'];
    return adminRoles.includes(userRole || '');
}

export function useFeatureFlags() {
    const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);
    const { user } = useAuth();

    useEffect(() => {
        // In the future, this could fetch from a remote config or env vars
        // const envFlags = process.env.NEXT_PUBLIC_FEATURE_FLAGS;
        setFlags(defaultFlags);
    }, []);

    const userRole = user?.role;
    const isAdmin = hasAdminAccess('eventsCreate', userRole);

    // Helper to check if a specific feature is enabled for current user
    const checkFeature = (feature: keyof FeatureFlags): boolean => {
        return isFeatureEnabled(flags, feature, isAdmin);
    };

    return {
        flags,
        isAdmin,
        checkFeature,
        isFeatureEnabled: (feature: keyof FeatureFlags) => checkFeature(feature),
    };
}
