# Design Document: Android TWA Conversion

## Overview

This design describes the technical approach for converting the LINKER web application into an Android app using Trusted Web Activity (TWA). The solution leverages the existing production PWA and packages it as a native Android app without code duplication. The architecture maintains the web-first approach while gaining Play Store distribution and native app credibility.

The implementation uses Google's Bubblewrap CLI to generate an Android project that wraps the PWA in a Chrome Custom Tab running in fullscreen mode. Digital Asset Links verification ensures the app displays without browser UI chrome.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Play Store                         │
│                         (AAB)                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Android TWA App                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              LauncherActivity                        │    │
│  │  - Chrome availability check                         │    │
│  │  - Intent filter handling                            │    │
│  │  - Deep link routing                                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Trusted Web Activity (Chrome)              │    │
│  │  - Fullscreen rendering                              │    │
│  │  - Service worker support                            │    │
│  │  - Push notification handling                        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   LINKER Web App (Vercel)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Next.js     │  │  Service     │  │  Asset       │       │
│  │  Frontend    │  │  Worker      │  │  Links       │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              NestJS Backend (Render)                 │    │
│  │  - API endpoints                                     │    │
│  │  - Supabase auth                                     │    │
│  │  - Feature flags                                     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. PWA Enhancement Layer

Responsible for ensuring the existing PWA meets TWA requirements.

**Icon Generator**
- Input: Source SVG icon (apps/web/public/icons/icon.svg)
- Output: PNG icons at 192x192 and 512x512 pixels
- Tool: Sharp or similar image processing library

**Manifest Updates**
```json
{
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-192-maskable.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### 2. Digital Asset Links Configuration

**File Location**: `apps/web/public/.well-known/assetlinks.json`

**Structure**:
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.linker.campus",
      "sha256_cert_fingerprints": ["<SHA256_FROM_KEYSTORE>"]
    }
  }
]
```

**Next.js Configuration** (next.config.js):
```javascript
async rewrites() {
  return [
    {
      source: '/.well-known/assetlinks.json',
      destination: '/api/assetlinks',
    },
  ];
}
```

### 3. TWA Android Project

Generated via Bubblewrap with the following configuration:

**twa-manifest.json**:
```json
{
  "packageId": "com.linker.campus",
  "host": "linker-app.vercel.app",
  "name": "LINKER – Campus OS",
  "launcherName": "LINKER",
  "startUrl": "/dashboard",
  "iconUrl": "https://linker-app.vercel.app/icons/icon-512.png",
  "maskableIconUrl": "https://linker-app.vercel.app/icons/icon-512-maskable.png",
  "themeColor": "#000000",
  "navigationColor": "#000000",
  "backgroundColor": "#FDF6E3",
  "enableNotifications": true,
  "orientation": "portrait",
  "displayMode": "standalone",
  "shortcuts": [],
  "signing": {
    "keyPath": "./android.keystore",
    "alias": "linker"
  },
  "fallbackType": "customtabs",
  "splashScreenFadeOutDuration": 300
}
```

### 4. Feature Flag System

**Interface**:
```typescript
interface FeatureFlags {
  feed: boolean;
  eventsView: boolean;
  eventsCreate: boolean;
  chat: boolean;
  marketplace: boolean;
  communities: boolean;
  classroom: boolean;
  collab: boolean;
}

interface FeatureFlagConfig {
  flags: FeatureFlags;
  adminOverrides: string[]; // Feature keys admins can always access
}
```

**Default Launch Configuration**:
```typescript
const launchFlags: FeatureFlags = {
  feed: true,
  eventsView: true,
  eventsCreate: false, // Admin only
  chat: true,
  marketplace: true,  // Limited functionality
  communities: false,
  classroom: false,
  collab: false,
};
```

### 5. Legal Pages Component

**Routes**:
- `/legal/privacy` - Privacy Policy page
- `/legal/terms` - Terms of Service page

**Component Structure**:
```typescript
interface LegalPageProps {
  title: string;
  lastUpdated: string;
  content: string;
}
```

### 6. Chrome Fallback Handler

**Android Implementation** (in LauncherActivity):
```kotlin
private fun checkChromeAvailability(): Boolean {
  val packageManager = packageManager
  return try {
    packageManager.getPackageInfo("com.android.chrome", 0)
    true
  } catch (e: PackageManager.NameNotFoundException) {
    false
  }
}

private fun showChromeRequiredDialog() {
  // Display dialog prompting user to install/enable Chrome
}
```

## Data Models

### Asset Links Schema

```typescript
interface AssetLink {
  relation: string[];
  target: {
    namespace: 'android_app';
    package_name: string;
    sha256_cert_fingerprints: string[];
  };
}

type AssetLinksFile = AssetLink[];
```

### PWA Manifest Icon Schema

```typescript
interface ManifestIcon {
  src: string;
  sizes: string;
  type: 'image/png' | 'image/svg+xml';
  purpose: 'any' | 'maskable';
}
```

### Feature Flag Storage

```typescript
interface StoredFeatureFlags {
  version: number;
  updatedAt: string;
  flags: FeatureFlags;
}
```

### Build Configuration

```typescript
interface TWABuildConfig {
  packageId: string;
  host: string;
  name: string;
  startUrl: string;
  themeColor: string;
  backgroundColor: string;
  enableNotifications: boolean;
  orientation: 'portrait' | 'landscape' | 'any';
  minChromeVersion: number;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Manifest Icon Configuration Validity

*For any* valid PWA manifest, all icon entries SHALL have:
- A valid `src` path pointing to an existing PNG file
- A `sizes` value matching the actual image dimensions
- A `type` of "image/png"
- A `purpose` of either "any" or "maskable"
- At least one icon at 192x192 and one at 512x512 dimensions

**Validates: Requirements 1.2, 1.3**

### Property 2: Asset Links File Validity

*For any* valid assetlinks.json file:
- The `package_name` SHALL equal "com.linker.campus"
- The `sha256_cert_fingerprints` array SHALL contain at least one valid SHA256 fingerprint (64 hex characters with colons)
- The `relation` array SHALL contain "delegate_permission/common.handle_all_urls"
- The `namespace` SHALL equal "android_app"

**Validates: Requirements 2.2, 2.3, 2.5**

### Property 3: Service Worker Precache Routes

*For any* service worker configuration, the PRECACHE_ASSETS array SHALL include all essential navigation routes: `/dashboard`, `/explore`, `/events`, `/messages`, and `/offline`.

**Validates: Requirements 5.3**

### Property 4: Feature Flag System Behavior

*For any* feature flag configuration and any feature key, when the flag is set to `false`, the corresponding feature SHALL be inaccessible to non-admin users. When set to `true`, the feature SHALL be accessible.

**Validates: Requirements 6.1**

### Property 5: Admin Override for Feature Flags

*For any* user with admin role and any feature in the `adminOverrides` list, that feature SHALL be accessible regardless of the feature flag value.

**Validates: Requirements 6.4**

### Property 6: Session Persistence on Login

*For any* successful authentication, the session token SHALL be stored in persistent storage and SHALL be retrievable on subsequent app launches.

**Validates: Requirements 8.1**

### Property 7: Session Expiry Redirect

*For any* expired or invalid session token, navigation to protected routes SHALL redirect to the login page without throwing errors.

**Validates: Requirements 8.3**

### Property 8: Theme Color Consistency

*For any* theme configuration (light or dark mode), the manifest `theme_color` and `background_color` SHALL match the app's defined color scheme values.

**Validates: Requirements 4.4**

## Play Store Policy Compliance

- LINKER does not collect or share personal data without user consent
- LINKER complies with Google Play User Data policies
- No background location, microphone, or camera access is used
- Push notifications are user-initiated and can be disabled
- Content moderation and reporting mechanisms are implemented
- Admin actions are logged and auditable

## External URL Handling

**Internal URLs** (remain inside TWA):
- All routes under the LINKER domain
- `/dashboard`, `/events`, `/messages`, `/explore`, `/marketplace`, etc.

**External URLs** (open via Android ACTION_VIEW intent):
- OAuth provider URLs (Supabase auth redirects)
- Payment gateway URLs
- Third-party websites linked in content
- Social media share targets

**Implementation**: Configure `externalUrls` in twa-manifest.json to specify URL patterns that should open externally.

## Release Strategy

| Track | Audience | Purpose |
|-------|----------|---------|
| Internal Testing | 5–10 devices (dev team) | Smoke testing, crash detection |
| Closed Testing | 50–100 users (own campus) | Real-world validation, feedback |
| Staged Production | 10% → 50% → 100% | Gradual rollout, risk mitigation |

**Rollback Plan**:
- Emergency rollback supported via Play Console
- Feature flags used to disable unstable features without redeploy
- Previous AAB version can be promoted if critical issues found

## App Identity & Trust Signals

**Splash Screen**:
- Display LINKER logo centered
- Show campus tagline: "Your Campus. Connected."
- Fade duration: 300ms

**First Launch Experience**:
- Display "Powered by your campus" welcome message
- Request notification permission with clear value proposition
- Guide user to login or signup

## Error Handling

### Chrome Availability Errors

| Error Condition | Handling Strategy |
|----------------|-------------------|
| Chrome not installed | Display dialog with Play Store link to install Chrome |
| Chrome disabled | Display dialog prompting user to enable Chrome in settings |
| Chrome version too old | Display dialog with Play Store link to update Chrome |
| Chrome crashes during TWA launch | Fall back to Custom Tabs mode with browser UI |

### Network Errors

| Error Condition | Handling Strategy |
|----------------|-------------------|
| No network connection | Serve cached content via service worker |
| API request timeout | Show retry button with cached fallback |
| SSL certificate error | Display security warning, do not proceed |
| Asset links verification failure | App runs in Custom Tabs mode (with browser UI) |

### Authentication Errors

| Error Condition | Handling Strategy |
|----------------|-------------------|
| Session expired | Redirect to login with "session expired" message |
| Invalid token | Clear storage, redirect to login |
| Supabase unavailable | Show offline mode with cached data |
| Cookie storage blocked | Fall back to localStorage for session |

### Build Errors

| Error Condition | Handling Strategy |
|----------------|-------------------|
| Keystore not found | Abort build with clear error message |
| Invalid manifest URL | Abort Bubblewrap init with URL validation error |
| Icon generation failure | Abort build, require manual icon creation |
| Gradle build failure | Log detailed error, check Android SDK setup |

## Testing Strategy

### Dual Testing Approach

This project uses both unit tests and property-based tests:
- **Unit tests**: Verify specific examples, edge cases, and integration points
- **Property tests**: Verify universal properties across generated inputs

### Property-Based Testing Configuration

- **Library**: fast-check (TypeScript)
- **Minimum iterations**: 100 per property test
- **Tag format**: `Feature: android-twa-conversion, Property {number}: {property_text}`

### Test Categories

#### 1. Configuration Validation Tests

| Test Type | Description | Properties Covered |
|-----------|-------------|-------------------|
| Property | Manifest icon validation | Property 1 |
| Property | Asset links validation | Property 2 |
| Property | Theme color consistency | Property 8 |
| Unit | TWA manifest structure | 3.2, 3.3, 3.4 |
| Unit | Orientation setting | 4.2 |

#### 2. Feature Flag Tests

| Test Type | Description | Properties Covered |
|-----------|-------------|-------------------|
| Property | Flag enable/disable behavior | Property 4 |
| Property | Admin override behavior | Property 5 |
| Unit | Default launch configuration | 6.2, 6.3 |

#### 3. Service Worker Tests

| Test Type | Description | Properties Covered |
|-----------|-------------|-------------------|
| Property | Precache routes inclusion | Property 3 |
| Unit | Offline page availability | 5.2, 5.5 |
| Integration | Cache-first strategy | 5.1 |

#### 4. Authentication Tests

| Test Type | Description | Properties Covered |
|-----------|-------------|-------------------|
| Property | Session persistence | Property 6 |
| Property | Expiry redirect | Property 7 |
| Unit | Session restoration | 8.2 |
| Edge case | Cookie-blocked fallback | 8.5 |

#### 5. Legal Pages Tests

| Test Type | Description |
|-----------|-------------|
| Unit | Privacy page exists at /legal/privacy |
| Unit | Terms page exists at /legal/terms |
| Integration | Pages cacheable for offline |

### Manual Testing Checklist

The following require manual device testing:

- [ ] App displays fullscreen without browser UI (4.1)
- [ ] Back button navigates correctly (4.3)
- [ ] Touch feedback on interactive elements (4.5)
- [ ] No hover-only interactions (4.6)
- [ ] Push notifications display correctly (9.1-9.5)
- [ ] Deep links open in app (12.1-12.3)
- [ ] Chrome missing/disabled handling (11.1, 11.3, 11.4)
- [ ] Play Store listing compliance (7.1-7.7)

### Test File Structure

```
apps/web/__tests__/
├── properties/
│   ├── manifest-validation.property.test.ts
│   ├── assetlinks-validation.property.test.ts
│   ├── feature-flags.property.test.ts
│   ├── session-management.property.test.ts
│   └── service-worker.property.test.ts
├── unit/
│   ├── twa-config.test.ts
│   ├── legal-pages.test.ts
│   └── offline-page.test.ts
└── integration/
    └── pwa-readiness.test.ts
```
