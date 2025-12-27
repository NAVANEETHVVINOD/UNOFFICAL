# Requirements Document

## Introduction

This specification covers the conversion of the LINKER web application into an Android app using Trusted Web Activity (TWA). TWA allows the existing production-ready Next.js PWA to be packaged as a native Android app and distributed via the Google Play Store without code duplication or UI rewrites. The approach leverages Chrome's rendering engine to display the web app in fullscreen mode with native app credibility.

## Glossary

- **TWA**: Trusted Web Activity - Android feature that allows web content to be displayed in fullscreen mode within an Android app, powered by Chrome
- **PWA**: Progressive Web App - Web application with native-like capabilities including offline support, installability, and push notifications
- **Bubblewrap**: Google's official CLI tool for generating TWA Android projects from PWA manifests
- **Digital_Asset_Links**: JSON file that proves domain ownership to Google, enabling TWA verification
- **AAB**: Android App Bundle - Publishing format for Android apps on Google Play Store
- **APK**: Android Package - Installable Android application file for testing
- **Service_Worker**: JavaScript file that enables offline functionality and push notifications
- **Manifest**: JSON file describing PWA metadata including name, icons, theme colors, and start URL
- **Feature_Flag**: Configuration toggle to enable/disable features for controlled rollout

## Requirements

### Requirement 1: PWA Icon Compliance

**User Story:** As a mobile user, I want to see proper app icons on my device, so that LINKER looks professional and is easily identifiable.

#### Acceptance Criteria

1. THE Icon_Generator SHALL produce PNG icons in 192x192 and 512x512 pixel dimensions
2. THE Manifest SHALL reference PNG icons with correct sizes and MIME types
3. THE Icon_Set SHALL include both regular and maskable icon variants for adaptive icon support
4. WHEN the app is installed, THE System SHALL display the correct icon on the home screen and app drawer

### Requirement 2: Digital Asset Links Configuration

**User Story:** As a developer, I want to configure Digital Asset Links, so that Google can verify domain ownership and enable fullscreen TWA mode.

#### Acceptance Criteria

1. THE Web_Server SHALL serve the assetlinks.json file at /.well-known/assetlinks.json
2. THE Assetlinks_File SHALL contain the correct package name (com.linker.campus)
3. THE Assetlinks_File SHALL contain the SHA256 certificate fingerprint from the signing keystore
4. WHEN accessed via HTTPS, THE Assetlinks_Endpoint SHALL return HTTP 200 with application/json content type
5. THE Assetlinks_File SHALL use the delegate_permission/common.handle_all_urls relation

### Requirement 3: TWA Android Project Generation

**User Story:** As a developer, I want to generate an Android project from the PWA, so that I can build and deploy to the Play Store.

#### Acceptance Criteria

1. WHEN Bubblewrap initializes, THE Tool SHALL read the manifest from the production URL
2. THE Android_Project SHALL use package name com.linker.campus
3. THE Android_Project SHALL target the /dashboard start URL
4. THE Android_Project SHALL enable push notification support
5. THE Android_Project SHALL generate a signing keystore for release builds
6. THE Build_System SHALL produce both APK (for testing) and AAB (for Play Store) outputs

### Requirement 4: Mobile UX Optimization

**User Story:** As a mobile user, I want the app to feel native on my Android device, so that I have a seamless experience.

#### Acceptance Criteria

1. THE App SHALL display in fullscreen mode without browser UI chrome
2. THE App SHALL use portrait orientation as the primary display mode
3. THE Back_Button SHALL navigate within the app without exiting unexpectedly
4. THE Theme_Color SHALL match the app's visual identity (#000000 for dark, #FDF6E3 for light)
5. WHEN a user taps interactive elements, THE System SHALL provide appropriate touch feedback
6. THE App SHALL NOT display hover-only interactions that are inaccessible on touch devices

### Requirement 5: Offline Functionality

**User Story:** As a mobile user, I want to access basic app features when offline, so that I can still use LINKER with poor connectivity.

#### Acceptance Criteria

1. WHEN the device is offline, THE App SHALL display a cached version of previously visited pages
2. WHEN the device is offline and no cache exists, THE App SHALL display a branded offline page
3. THE Service_Worker SHALL cache essential navigation routes (/dashboard, /explore, /events, /messages)
4. WHEN connectivity is restored, THE App SHALL retry failed actions gracefully
5. THE Offline_Page SHALL provide clear messaging about connectivity status

### Requirement 6: Feature Gating for Launch

**User Story:** As a product owner, I want to control which features are available at launch, so that I can ensure a stable initial release.

#### Acceptance Criteria

1. THE Feature_Flag_System SHALL support enabling/disabling features by configuration
2. WHEN launching, THE App SHALL enable: Feed, Events (view), Chat, and Marketplace (limited)
3. WHEN launching, THE App SHALL disable: Communities, Classroom, Collab, and Events (create for non-admins)
4. THE Admin_Panel SHALL allow college administrators to create events regardless of feature flags
5. THE Feature_Flags SHALL be configurable without requiring app updates

### Requirement 7: Play Store Compliance

**User Story:** As a developer, I want to meet Play Store requirements, so that the app can be published and distributed.

#### Acceptance Criteria

1. THE App_Listing SHALL include app name "LINKER – Campus OS"
2. THE App_Listing SHALL be categorized under Education/Social
3. THE App_Listing SHALL specify content rating of 13+
4. THE App_Listing SHALL include a privacy policy URL at /legal/privacy
5. THE App_Listing SHALL include terms of service URL at /legal/terms
6. THE App_Bundle SHALL be signed with a release keystore
7. THE App_Listing SHALL include screenshots for phone and tablet form factors

### Requirement 8: Session and Authentication Persistence

**User Story:** As a mobile user, I want to stay logged in across app sessions, so that I don't have to re-authenticate frequently.

#### Acceptance Criteria

1. WHEN a user logs in, THE App SHALL persist the authentication session
2. WHEN the app is reopened, THE System SHALL restore the previous session if valid
3. WHEN the session expires, THE App SHALL redirect to the login page gracefully
4. THE Auth_System SHALL work correctly with Supabase authentication in TWA context
5. IF cookies are blocked, THEN THE App SHALL fall back to alternative session storage

### Requirement 9: Push Notification Integration

**User Story:** As a mobile user, I want to receive push notifications, so that I stay informed about campus activities.

#### Acceptance Criteria

1. THE App SHALL request notification permissions on first launch or appropriate trigger
2. WHEN a push notification is received, THE System SHALL display it in the Android notification tray
3. WHEN a user taps a notification, THE App SHALL navigate to the relevant content
4. THE Notification_System SHALL support notification actions (Open, Dismiss)
5. THE Push_Infrastructure SHALL integrate with Firebase Cloud Messaging for delivery

### Requirement 10: Legal Pages Availability

**User Story:** As a user, I want to access privacy policy and terms of service, so that I understand how my data is handled.

#### Acceptance Criteria

1. THE App SHALL provide a privacy policy page at /legal/privacy
2. THE App SHALL provide a terms of service page at /legal/terms
3. THE Legal_Pages SHALL be accessible from the app settings or profile area
4. THE Legal_Pages SHALL be viewable offline if previously cached

### Requirement 11: Chrome Dependency Management

**User Story:** As a mobile user, I want the app to handle Chrome availability gracefully, so that the app does not crash or fail to launch.

#### Acceptance Criteria

1. IF Chrome is missing or disabled, THEN THE App SHALL display a user-friendly message prompting installation or update
2. THE App SHALL specify minimum Chrome version required for TWA functionality
3. THE App SHALL NOT crash on launch due to missing Chrome dependencies
4. IF Chrome is unavailable, THEN THE App SHALL provide a fallback error screen with recovery instructions

### Requirement 12: Deep Link and Intent Routing

**User Story:** As a mobile user, I want links to open directly inside the app, so that navigation feels native and seamless.

#### Acceptance Criteria

1. WHEN a LINKER URL is opened externally, THE App SHALL handle it via Android intent filters
2. WHEN a notification is tapped, THE App SHALL route users to the correct in-app destination
3. WHEN a shared link is opened, THE App SHALL display the content inside the app if installed
4. IF an unsupported URL is encountered, THEN THE App SHALL fall back to browser safely

### Requirement 13: Monitoring and Stability

**User Story:** As a product owner, I want visibility into app usage and stability, so that issues can be detected and fixed quickly.

#### Acceptance Criteria

1. THE App SHALL integrate crash reporting via Play Console vitals
2. THE App SHALL track basic analytics (installs, sessions, screen views)
3. THE Error_Logging SHALL NOT expose user-sensitive data
4. THE Monitoring SHALL NOT negatively impact app performance
