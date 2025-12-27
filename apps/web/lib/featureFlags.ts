/**
 * Feature Flags Configuration for LINKER
 * 
 * This module provides feature flag utilities that can be used
 * both in React components and server-side code.
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
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
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

// Admin roles that can override feature flags
export const ADMIN_ROLES = ['COLLEGE_ADMIN', 'PLATFORM_ADMIN', 'CLUB_ADMIN'];

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
    return ADMIN_ROLES.includes(userRole || '');
}

/**
 * Get feature flags from environment or defaults
 * Can be extended to fetch from remote config
 */
export function getFeatureFlags(): FeatureFlags {
    // In the future, this could fetch from environment variables
    // or a remote configuration service
    return DEFAULT_FEATURE_FLAGS;
}
