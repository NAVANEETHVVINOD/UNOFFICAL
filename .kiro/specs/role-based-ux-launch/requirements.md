# Requirements Document

## Introduction

This document specifies the requirements for a focused launch redesign of LINKER as an "Events OS for Students & Organizers." The system will add a UX personalization layer through user type selection during onboarding, route users to role-specific dashboards, hide non-essential features behind feature flags, and simplify navigation to 4 items maximum. This is a UX personalization system (userType) that is separate from the existing permission-based RBAC system (role).

## Glossary

- **User_Type**: A UX personalization field (STUDENT, PROFESSIONAL, ORGANIZER, TEACHER) that determines dashboard layout and feature visibility, separate from permission roles
- **Permission_Role**: The existing RBAC role (STUDENT, CLUB_ADMIN, COLLEGE_ADMIN, PLATFORM_ADMIN) that controls actual permissions
- **Student_Dashboard**: Events-focused dashboard for students with RSVP, Save, Share, and View Details actions
- **Organizer_Dashboard**: Event management dashboard showing created events, registrations, and analytics
- **Teacher_Dashboard**: Classroom-focused dashboard showing classrooms, verified events, and attendance requests
- **Professional_Dashboard**: Similar to Student_Dashboard but defaults to Global Events view
- **Feature_Flag**: A configuration that enables or disables specific features based on user type
- **User_Type_Selector**: The onboarding step where users choose their user type
- **Campus_Events**: Events visible only to users from the same college
- **Global_Events**: Events visible to all LINKER users
- **FAB**: Floating Action Button for quick actions on mobile

## Requirements

### Requirement 1: User Type Selection During Onboarding

**User Story:** As a new user, I want to select my user type during onboarding, so that the platform adapts to my needs.

#### Acceptance Criteria

1. WHEN a user completes signup or first login, THE Onboarding_Flow SHALL display a "Who are you?" step before the dashboard
2. THE User_Type_Selector SHALL display four options: Student, Professional, Event Organizer, Teacher/Faculty
3. WHEN a user selects a user type, THE System SHALL store it as the userType field on the User/Profile model
4. THE userType field SHALL be separate from the existing permission role field
5. WHEN a user skips the selection, THE System SHALL default to STUDENT user type
6. THE User_Type_Selector SHALL display clear descriptions for each option explaining what experience they will get

### Requirement 2: User Type Modification in Settings

**User Story:** As a user, I want to change my user type in settings, so that I can switch my experience if my needs change.

#### Acceptance Criteria

1. WHEN a user accesses Settings, THE Settings_Page SHALL display a "User Type" section
2. THE Settings_Page SHALL allow changing user type to any of the four options
3. WHEN a user changes their user type, THE System SHALL update the userType field immediately
4. WHEN a user changes their user type, THE System SHALL redirect to the appropriate dashboard
5. THE Settings_Page SHALL display the current user type with a visual indicator

### Requirement 3: Role-Based Dashboard Routing

**User Story:** As a user, I want to be routed to a dashboard that matches my user type, so that I see relevant content immediately.

#### Acceptance Criteria

1. WHEN a STUDENT user accesses the dashboard, THE System SHALL display the Student_Dashboard
2. WHEN a PROFESSIONAL user accesses the dashboard, THE System SHALL display the Professional_Dashboard
3. WHEN an ORGANIZER user accesses the dashboard, THE System SHALL display the Organizer_Dashboard
4. WHEN a TEACHER user accesses the dashboard, THE System SHALL display the Teacher_Dashboard
5. WHEN the userType is not set, THE System SHALL redirect to the User_Type_Selector

### Requirement 4: Student Dashboard Design

**User Story:** As a student, I want a clean, events-focused dashboard, so that I can discover and attend events without distractions.

#### Acceptance Criteria

1. THE Student_Dashboard SHALL display three sections: Upcoming Events, Campus Events, Recommended Events
2. THE Student_Dashboard SHALL NOT display FeedComposer or post creation functionality
3. THE Student_Dashboard SHALL NOT display social feed posts
4. WHEN displaying event cards, THE Student_Dashboard SHALL show: Organizer name, Verification badge, Date/Venue, Register CTA
5. THE Student_Dashboard SHALL provide action buttons: RSVP, Save, Share, View Details
6. WHEN a user has a linked college, THE Student_Dashboard SHALL display Campus Events section
7. WHEN a user has no linked college, THE Student_Dashboard SHALL hide the Campus Events section

### Requirement 5: Professional Dashboard Design

**User Story:** As a professional, I want a dashboard similar to students but with global events focus, so that I can find networking opportunities.

#### Acceptance Criteria

1. THE Professional_Dashboard SHALL display the same layout as Student_Dashboard
2. THE Professional_Dashboard SHALL default to Global Events view instead of Campus Events
3. THE Professional_Dashboard SHALL NOT display FeedComposer or post creation functionality
4. THE Professional_Dashboard SHALL provide the same action buttons as Student_Dashboard

### Requirement 6: Organizer Dashboard Design

**User Story:** As an event organizer, I want an event management dashboard, so that I can create and manage my events efficiently.

#### Acceptance Criteria

1. THE Organizer_Dashboard SHALL display "Your Events" section as the primary content
2. THE Organizer_Dashboard SHALL display a prominent "Create Event" button
3. WHEN displaying event cards, THE Organizer_Dashboard SHALL show: Registrations count, Attendance percentage, Revenue (if paid), Status (Draft/Live/Ended)
4. THE Organizer_Dashboard SHALL provide quick access to: QR Scanner, Analytics, Attendee list
5. THE Organizer_Dashboard SHALL display events sorted by status (Live first, then Draft, then Ended)
6. WHEN an organizer has no events, THE Organizer_Dashboard SHALL display an empty state with "Create Your First Event" CTA

### Requirement 7: Teacher Dashboard Design

**User Story:** As a teacher, I want a classroom-focused dashboard, so that I can manage attendance and verified events.

#### Acceptance Criteria

1. THE Teacher_Dashboard SHALL display three sections: My Classrooms, Upcoming Verified Events, Attendance Requests
2. THE Teacher_Dashboard SHALL provide quick access to classroom management
3. WHEN displaying classrooms, THE Teacher_Dashboard SHALL show: Classroom name, Student count, Recent activity
4. THE Teacher_Dashboard SHALL display events that require teacher verification
5. THE Teacher_Dashboard SHALL display pending attendance verification requests

### Requirement 8: Desktop Navigation Simplification

**User Story:** As a desktop user, I want simplified navigation with 4 items, so that I can focus on core features.

#### Acceptance Criteria

1. THE Desktop_Navigation SHALL display exactly 4 items: Dashboard, Events, Messages, Profile
2. THE Desktop_Navigation SHALL remove: College, Explore, Marketplace, Notes, Communities, Collaboration
3. WHEN a user clicks Dashboard, THE System SHALL navigate to their role-specific dashboard
4. THE Desktop_Navigation SHALL maintain consistent styling with the existing design system

### Requirement 9: Mobile Navigation Simplification

**User Story:** As a mobile user, I want simplified bottom navigation with a contextual FAB, so that I can access core features easily.

#### Acceptance Criteria

1. THE Mobile_Bottom_Nav SHALL display exactly 4 items: Home, Events, Chat, Profile
2. WHEN the user type is ORGANIZER, THE Mobile_Bottom_Nav SHALL display a Floating Action Button for event creation
3. WHEN the user type is NOT ORGANIZER, THE Mobile_Bottom_Nav SHALL NOT display the FAB
4. THE Mobile_Bottom_Nav SHALL remove: College, Explore, Post button
5. WHEN a user taps the FAB, THE System SHALL open the event creation flow

### Requirement 10: Feature Gating by User Type

**User Story:** As a platform, I want to gate features by user type, so that users see only relevant functionality.

#### Acceptance Criteria

1. THE Feature_Flag_System SHALL enable for all user types: Events view, Event RSVP, QR check-in, Certificates, Messaging
2. THE Feature_Flag_System SHALL enable Event creation only for ORGANIZER user type
3. THE Feature_Flag_System SHALL hide Social feed and post creation for STUDENT user type
4. THE Feature_Flag_System SHALL hide Communities for all user types at launch
5. THE Feature_Flag_System SHALL hide Collaboration for all user types at launch
6. THE Feature_Flag_System SHALL set Marketplace to read-only for all user types at launch
7. THE Feature_Flag_System SHALL set Notes to read-only for all user types at launch

### Requirement 11: Events Page Tabs by User Type

**User Story:** As a user, I want events page tabs that match my user type, so that I see relevant event categories.

#### Acceptance Criteria

1. WHEN a STUDENT views the Events page, THE Events_Page SHALL display tabs: Campus, Open Events, My RSVPs
2. WHEN a PROFESSIONAL views the Events page, THE Events_Page SHALL display tabs: All Events, My RSVPs
3. WHEN an ORGANIZER views the Events page, THE Events_Page SHALL display tabs: My Events, All Events
4. WHEN a TEACHER views the Events page, THE Events_Page SHALL display tabs: Verified Events, Campus Events, My RSVPs
5. THE Events_Page SHALL default to the first tab for each user type

### Requirement 12: Hide College Admin from Onboarding

**User Story:** As a platform, I want to hide College Admin from user type selection, so that regular users have a simpler onboarding.

#### Acceptance Criteria

1. THE User_Type_Selector SHALL NOT display College Admin as a selectable option
2. THE College_Admin role SHALL only be assigned through manual invitation or Platform Admin assignment
3. WHEN a user is assigned College Admin role, THE System SHALL NOT change their userType
4. THE userType and permission role SHALL remain independent

### Requirement 13: User Type Icons and Labels

**User Story:** As a user, I want clear visual indicators for each user type, so that I understand my selection.

#### Acceptance Criteria

1. THE User_Type_Selector SHALL display an icon for each option: 🎓 Student, 🧑‍💼 Professional, 🎤 Organizer, 👨‍🏫 Teacher
2. THE User_Type_Selector SHALL display a subtitle for each option explaining the experience
3. THE Settings_Page SHALL display the same icons when showing current user type
4. THE Dashboard SHALL display the user type icon in the profile section

### Requirement 14: Dashboard Component Architecture

**User Story:** As a developer, I want separate dashboard components for each user type, so that the code is maintainable.

#### Acceptance Criteria

1. THE System SHALL create StudentDashboard component for STUDENT user type
2. THE System SHALL create ProfessionalDashboard component for PROFESSIONAL user type
3. THE System SHALL create OrganizerDashboard component for ORGANIZER user type
4. THE System SHALL create TeacherDashboard component for TEACHER user type
5. THE DashboardClient SHALL route to the appropriate component based on userType
6. EACH dashboard component SHALL be independently testable

### Requirement 15: Feature Flag Integration with User Type

**User Story:** As a developer, I want feature flags to consider user type, so that features can be gated appropriately.

#### Acceptance Criteria

1. THE isFeatureEnabled function SHALL accept userType as an optional parameter
2. WHEN checking feature access, THE Feature_Flag_System SHALL consider both userType and permission role
3. THE Feature_Flag_System SHALL support per-userType feature overrides
4. THE Feature_Flag_System SHALL maintain backward compatibility with existing role-based checks

### Requirement 16: Onboarding Flow Integration

**User Story:** As a user, I want the user type selection to integrate smoothly with existing onboarding, so that the experience is seamless.

#### Acceptance Criteria

1. THE User_Type_Selector step SHALL appear after the existing identity step
2. THE User_Type_Selector step SHALL appear before the campus selection step
3. WHEN a user completes user type selection, THE System SHALL save the selection before proceeding
4. THE Onboarding_Progress_Indicator SHALL include the user type step
5. WHEN editing profile, THE System SHALL allow returning to user type selection

### Requirement 17: Backend User Type Field

**User Story:** As a developer, I want a userType field on the User/Profile model, so that the selection persists correctly.

#### Acceptance Criteria

1. THE User model or Profile model SHALL include a userType field with enum values: STUDENT, PROFESSIONAL, ORGANIZER, TEACHER
2. THE userType field SHALL default to null until explicitly set
3. THE API SHALL expose endpoints to get and update userType
4. THE userType field SHALL be included in the user profile response
5. THE userType field SHALL be separate from the existing role field

### Requirement 18: Dashboard Loading States

**User Story:** As a user, I want appropriate loading states for my dashboard, so that I know content is loading.

#### Acceptance Criteria

1. WHEN the dashboard is loading, THE System SHALL display skeleton loaders matching the dashboard layout
2. WHEN userType is being determined, THE System SHALL display a loading state
3. WHEN redirecting to user type selection, THE System SHALL display a brief loading indicator
4. THE loading states SHALL match the existing design system

### Requirement 19: Event Card Consistency

**User Story:** As a user, I want consistent event cards across all dashboards, so that the experience is cohesive.

#### Acceptance Criteria

1. THE Event_Card component SHALL be reusable across all dashboard types
2. THE Event_Card SHALL support different display modes: attendee view, organizer view
3. WHEN in attendee view, THE Event_Card SHALL show: RSVP, Save, Share, View Details
4. WHEN in organizer view, THE Event_Card SHALL show: Registrations, Attendance %, Revenue, Status
5. THE Event_Card SHALL adapt to dark mode using the existing color palette

### Requirement 20: Navigation State Persistence

**User Story:** As a user, I want my navigation state to persist correctly, so that I return to the right place.

#### Acceptance Criteria

1. WHEN a user navigates away and returns, THE System SHALL restore the correct dashboard
2. THE System SHALL NOT cache the wrong dashboard type after user type change
3. WHEN userType changes, THE System SHALL clear any cached dashboard state
4. THE browser back button SHALL work correctly with role-based routing
