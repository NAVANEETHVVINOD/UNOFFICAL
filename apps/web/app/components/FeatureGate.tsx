'use client';

import { ReactNode } from 'react';
import { useFeatureFlags, FeatureFlags } from '../hooks/useFeatureFlags';

interface FeatureGateProps {
  feature: keyof FeatureFlags;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Feature Gate Component
 * 
 * Conditionally renders children based on feature flag status.
 * Automatically handles admin overrides.
 * 
 * Usage:
 * <FeatureGate feature="communities">
 *   <CommunitiesPage />
 * </FeatureGate>
 * 
 * With fallback:
 * <FeatureGate feature="classroom" fallback={<ComingSoon />}>
 *   <ClassroomPage />
 * </FeatureGate>
 */
export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const { isFeatureEnabled } = useFeatureFlags();

  if (isFeatureEnabled(feature)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Coming Soon Fallback Component
 * Default fallback for disabled features
 */
export function ComingSoon({ featureName }: { featureName?: string }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
          <span className="text-2xl">🚀</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-[var(--color-text-secondary)]">
          {featureName 
            ? `${featureName} is coming soon! We're working hard to bring you this feature.`
            : "This feature is coming soon! Stay tuned for updates."
          }
        </p>
      </div>
    </div>
  );
}

export default FeatureGate;
