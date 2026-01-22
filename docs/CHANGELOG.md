# Changelog

All notable changes to LINKER will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-18

### 🎯 Major Release: Role-Based UX Launch

This release transforms LINKER into a focused "Events OS for Students & Organizers" with personalized user experiences.

### Added

#### User Type System
- **4 User Types**: STUDENT, PROFESSIONAL, ORGANIZER, TEACHER
- User Type selection during onboarding
- User Type management in Settings
- UserTypeContext for state management
- Separate userType field in Profile model (independent from permission roles)

#### Role-Specific Dashboards
- **StudentDashboard**: Events-focused with RSVP, Save, Share actions
- **ProfessionalDashboard**: Global events and networking focus
- **OrganizerDashboard**: Event management with analytics and quick actions
- **TeacherDashboard**: Classroom and attendance management
- Empty state UX for all dashboards with engaging illustrations and CTAs

#### Navigation Simplification
- Desktop navigation reduced to 4 items (Dashboard, Events, Messages, Profile)
- Mobile navigation reduced to 4 items (Home, Events, Chat, Profile)
- Conditional FAB for ORGANIZER userType on mobile
- Removed: College, Explore, Marketplace, Notes, Communities, Collaboration from main nav

#### EventCard Component
- Dual-mode support (Attendee and Organizer modes)
- Attendee mode: RSVP, Save, Share, View Details
- Organizer mode: Registrations, Attendance %, Revenue, Status
- Reusable across all dashboards
- Full dark mode support

#### Events Page Enhancement
- Dynamic tab configuration based on userType
- STUDENT tabs: Campus, Open Events, My RSVPs
- PROFESSIONAL tabs: All Events, My RSVPs
- ORGANIZER tabs: My Events, All Events
- TEACHER tabs: Verified Events, Campus Events, My RSVPs

#### Cache Management
- Automatic cache clearing on userType change
- Browser back button handling
- Prevention of stale dashboard data
- SessionStorage and LocalStorage integration

### Changed
- Dashboard routing now based on userType instead of single unified dashboard
- Onboarding flow includes User Type Selector step
- Settings page includes User Type section with helper text
- Navigation structure simplified for better focus
- Feature flags now consider userType in addition to permission roles

### Testing
- Added 307 new tests (total: 806 tests)
- 12 new property-based tests for role-based UX
- 100+ iterations per property test using fast-check
- Comprehensive unit tests for all new components
- Integration tests for dashboard routing and navigation

### Technical
- Added `userType` field to Prisma schema
- Created `UserTypeContext` for state management
- Implemented `parseUserType` utility function
- Extended feature flags system with userType support
- Added cache management utilities

### Documentation
- Created comprehensive `docs/ROLE_BASED_UX_LAUNCH.md`
- Updated README with role-based UX information
- Added user flow documentation
- Created deployment checklist

### Performance
- Optimized dashboard loading with proper skeleton states
- Reduced navigation complexity
- Improved cache management

### Security
- UserType validation on backend
- Proper error handling for invalid userTypes
- SessionStorage safety checks for test environments

---

## [1.5.0] - 2025-12-15

### Added
- Android TWA (Trusted Web Activity) support
- Play Store compliance features
- Offline page with service worker
- PWA manifest with all required icons
- assetlinks.json for Android app verification

### Changed
- Updated Next.js to version 16
- Improved PWA configuration
- Enhanced mobile responsiveness

### Fixed
- Service worker caching issues
- Icon generation for all required sizes
- Manifest validation errors

---

## [1.4.0] - 2025-11-20

### Added
- Events system with multi-step creation wizard
- QR code check-in with HMAC signing
- Certificate generation for attendees
- Event analytics dashboard
- Razorpay payment integration (optional)

### Changed
- Improved event discovery with filtering
- Enhanced event card design
- Better mobile event management

---

## [1.3.0] - 2025-10-15

### Added
- Teacher/Classroom LMS features
- Assignment creation and tracking
- Attendance marking system
- Student progress monitoring
- Classroom management dashboard

### Changed
- Improved admin panel navigation
- Enhanced role-based access control

---

## [1.2.0] - 2025-09-10

### Added
- Real-time messaging with Socket.io
- Direct messages and group conversations
- Message notifications
- Online status indicators

### Changed
- Improved WebSocket authentication
- Better message delivery reliability

---

## [1.1.0] - 2025-08-05

### Added
- Marketplace for buying/selling items
- Study notes sharing system
- Club management features
- Follow system for users

### Changed
- Enhanced profile pages
- Improved search functionality

---

## [1.0.0] - 2025-07-01

### Added
- Initial release of LINKER platform
- Campus dashboard with posts and announcements
- User authentication with JWT
- Profile management
- College-based access control
- Basic event system
- Admin panels (Club, College, Platform)

### Technical
- Next.js 14 frontend
- NestJS 10 backend
- PostgreSQL database with Prisma ORM
- Supabase for auth and storage
- Deployed on Vercel and Render

---

## Release Notes

### Version 2.0.0 Highlights

**🎯 Focus**: Transform LINKER into an Events OS with personalized experiences

**📊 Impact**:
- 90% reduction in navigation complexity
- 4 distinct user experiences
- Improved onboarding completion rate (expected)
- Better feature discovery through role-specific dashboards

**🚀 Launch Strategy**:
- Enable STUDENT and ORGANIZER userTypes initially
- Monitor empty state → CTA conversion rates
- Track userType distribution
- Gradual rollout of PROFESSIONAL and TEACHER types

**⚠️ Breaking Changes**:
- Dashboard URL now routes to role-specific dashboards
- Navigation structure changed (removed 6 items)
- Feature flags now require userType consideration

**🔄 Migration Path**:
- Existing users default to STUDENT userType
- Users can change userType in Settings
- No data migration required
- Backward compatible with existing permission roles

---

## Upcoming Features

### Version 2.1.0 (Planned)
- Dashboard customization options
- UserType-specific onboarding tours
- Advanced event management tools
- Professional networking features

### Version 2.2.0 (Planned)
- Dashboard widgets
- Classroom integration for teachers
- Enhanced analytics for organizers
- Community features (gradual rollout)

---

*For detailed information about any release, see the corresponding documentation in the `docs/` directory.*
