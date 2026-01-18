/**
 * Feature Flags Configuration for LINKER
 * 
 * This module provides feature flag utilities that can be used
 * both in React components and server-side code.
 * 
 * TWA Launch Configuration:
 * - Enabled: feed, eventsView, chat, marketplace (limited)
 * - Disabled: communities, classroom, collab, eventsCreate (non-admin)
 * 
 * Role-Based UX Launch:
 * - Adds userType-based feature gating
 * - New flags: feedComposer, socialFeed, eventCreation, marketplaceWrite, notesWrite
 * - Requirements: 15.1, 15.2, 15.3, 15.4
 */

import { UserType, USER_TYPE_CONFIGS } from './userTypes';

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
    
    // UserType-specific features (Role-Based UX Launch)
    feedComposer: boolean;
    socialFeed: boolean;
    eventCreation: boolean;
    marketplaceWrite: boolean;
    notesWrite: boolean;
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
    
    // UserType-specific features (default disabled, controlled by userType)
    feedComposer: false,
    socialFeed: false,
    eventCreation: false,
    marketplaceWrite: false,
    notesWrite: false,
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

/**
 * Check if a feature is enabled for a specific user type
 * This function integrates userType-based feature gating with role-based permissions
 * 
 * @param feature Feature to check
 * @param userType User's UX personalization type (STUDENT, PROFESSIONAL, ORGANIZER, TEACHER)
 * @param permissionRole User's permission role (STUDENT, CLUB_ADMIN, COLLEGE_ADMIN, PLATFORM_ADMIN)
 * @returns Whether the feature is enabled for this user
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4
 * 
 * Feature Gating Rules (Requirement 10):
 * - feedComposer: Disabled for STUDENT and PROFESSIONAL userTypes
 * - socialFeed: Disabled for STUDENT and PROFESSIONAL userTypes
 * - eventCreation: Enabled only for ORGANIZER userType (or admins via role override)
 * - communities: Disabled for all userTypes at launch
 * - collab: Disabled for all userTypes at launch
 * - marketplaceWrite: Disabled for all userTypes at launch (read-only)
 * - notesWrite: Disabled for all userTypes at launch (read-only)
 */
export function isFeatureEnabledForUserType(
    feature: keyof FeatureFlags | string,
    userType: UserType | null,
    permissionRole?: string
): boolean {
    const flags = getFeatureFlags();
    const isAdmin = hasAdminAccess(feature as keyof FeatureFlags, permissionRole);
    
    // Admin override check (maintains backward compatibility)
    if (isAdmin && ADMIN_OVERRIDE_FEATURES.includes(feature as keyof FeatureFlags)) {
        return true;
    }
    
    // UserType-specific feature gating
    switch (feature) {
        case 'feedComposer':
        case 'socialFeed':
            // Disabled for STUDENT and PROFESSIONAL (Requirement 10.3)
            if (userType === UserType.STUDENT || userType === UserType.PROFESSIONAL) {
                return false;
            }
            // Enabled for ORGANIZER and TEACHER
            return userType === UserType.ORGANIZER || userType === UserType.TEACHER;
        
        case 'eventCreation':
        case 'eventsCreate':
            // Enabled only for ORGANIZER userType (Requirement 10.2)
            // Admins can override via role check above
            return userType === UserType.ORGANIZER;
        
        case 'communities':
            // Disabled for all userTypes at launch (Requirement 10.4)
            return false;
        
        case 'collab':
            // Disabled for all userTypes at launch (Requirement 10.5)
            return false;
        
        case 'marketplaceWrite':
            // Read-only for all userTypes at launch (Requirement 10.6)
            return false;
        
        case 'notesWrite':
            // Read-only for all userTypes at launch (Requirement 10.7)
            return false;
        
        case 'classroom':
            // Enabled only for TEACHER userType
            return userType === UserType.TEACHER;
        
        default:
            // For features not in FeatureFlags (like 'rsvp', 'qrCheckin', 'analytics'),
            // check the USER_TYPE_CONFIGS
            if (userType && typeof feature === 'string') {
                const config = USER_TYPE_CONFIGS[userType];
                if (config) {
                    return config.enabledFeatures.includes(feature);
                }
            }
            
            // For features in FeatureFlags, use the default flag value
            // This maintains backward compatibility (Requirement 15.4)
            if (feature in flags) {
                return flags[feature as keyof FeatureFlags];
            }
            
            // Unknown features default to disabled
            return false;
    }
}
