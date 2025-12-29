# Requirements Document

## Introduction

This document specifies the requirements for a comprehensive Events System redesign for LINKER. The system will enable users to create, discover, register for, and manage campus events with features including ticketing (free/paid), QR-based check-in, role management, certificate generation, custom registration forms, and payment processing via Razorpay. The design follows Luma/MakeMyPass patterns optimized for campus use.

## Glossary

- **Event**: A scheduled campus activity with defined time, location, and registration options
- **Event_Creator**: The user who creates and owns an event (full permissions)
- **Co_Organizer**: A user with management permissions for an event (manage event + refunds)
- **Head**: A user who can scan QR codes and manage on-site operations
- **Volunteer**: A user who can only scan QR codes for check-in
- **Attendee**: A user who has registered for an event
- **Ticket**: A registration option for an event (free or paid)
- **Registration**: A user's sign-up for an event with a specific ticket type
- **Check_In**: The process of marking an attendee as present at an event via QR scan
- **Certificate**: A PDF document issued to attendees upon event completion
- **Platform_Fee**: The percentage commission LINKER takes from paid ticket sales (default 3%)
- **Gateway_Fee**: The payment processor fee (Razorpay ~2%)
- **Global_Event**: An event visible to all LINKER users
- **Campus_Event**: An event visible only to users from the same college

## Requirements

### Requirement 1: Event Listing with Global/Campus Toggle

**User Story:** As a user, I want to browse events with a toggle between Global and Campus views, so that I can discover relevant events based on my preference.

#### Acceptance Criteria

1. WHEN a user visits the events page, THE Events_Page SHALL display a prominent toggle between "Global" and "Campus" views with Campus as the default
2. WHEN the user selects "Campus" view, THE Events_Page SHALL display only events from the user's college
3. WHEN the user selects "Global" view, THE Events_Page SHALL display all public events across all colleges
4. THE Events_Page SHALL provide filter options for date range (Today, This Week, This Month, All)
5. THE Events_Page SHALL provide filter options for event type (Free, Paid, All)
6. THE Events_Page SHALL provide a search input that filters events by title, description, and venue
7. WHEN displaying events, THE Events_Page SHALL show event card with: cover image, title, date/time, venue, price (or "Free"), attendee count, and organizer name
8. THE Events_Page SHALL sort events by start date (upcoming first) by default

### Requirement 2: Event Creation Wizard (Multi-Step Form)

**User Story:** As an organizer, I want to create events through a guided multi-step wizard, so that I can easily configure all event details without feeling overwhelmed.

#### Acceptance Criteria

1. WHEN a user clicks "Create Event", THE Create_Wizard SHALL display Step 1: Basic Info (title, description, cover image, campus/global toggle, categories, public/invite-only)
2. WHEN the user completes Step 1, THE Create_Wizard SHALL display Step 2: When & Where (date/time, timezone, venue or online link)
3. WHEN the user completes Step 2, THE Create_Wizard SHALL display Step 3: Tickets & Pricing (ticket types, prices, quantities, early-bird windows)
4. IF the event is paid, WHEN the user completes Step 3, THE Create_Wizard SHALL display Step 4: Payment Setup (Razorpay connection, fee breakdown)
5. WHEN the user completes Step 4 (or Step 3 for free events), THE Create_Wizard SHALL display Step 5: Registration Form (custom fields builder)
6. WHEN the user completes Step 5, THE Create_Wizard SHALL display Step 6: Roles & Volunteers (add co-organizers, heads, volunteers)
7. WHEN the user completes Step 6, THE Create_Wizard SHALL display Step 7: Certificates (template selection, auto-issue toggle)
8. WHEN the user completes Step 7, THE Create_Wizard SHALL display Step 8: Review & Publish (preview, share options)
9. THE Create_Wizard SHALL auto-save progress at each step
10. THE Create_Wizard SHALL display a progress indicator showing current step and completion status
11. THE Create_Wizard SHALL allow navigation back to previous steps without losing data

### Requirement 3: Ticket Types and Pricing

**User Story:** As an organizer, I want to create multiple ticket types with different prices and quantities, so that I can offer various registration options.

#### Acceptance Criteria

1. THE Ticket_System SHALL support creating multiple ticket types per event (e.g., Early Bird, General, Student, VIP)
2. FOR EACH ticket type, THE Ticket_System SHALL allow setting: name, price (0 for free), quantity limit, per-user limit, sales start/end dates
3. WHEN a ticket type has a quantity limit, THE Ticket_System SHALL prevent overselling by using atomic reservation
4. WHEN a ticket's sales window has not started, THE Registration_Page SHALL display "Sales start on [date]"
5. WHEN a ticket's sales window has ended, THE Registration_Page SHALL display "Sales ended"
6. WHEN a ticket is sold out, THE Registration_Page SHALL display "Sold out" and disable purchase
7. THE Ticket_System SHALL support a "Free event" toggle that skips payment configuration

### Requirement 4: Payment Processing with Razorpay

**User Story:** As an organizer, I want to accept payments for paid events through Razorpay, so that I can monetize my events securely.

#### Acceptance Criteria

1. WHEN an organizer creates a paid event, THE Payment_System SHALL require Razorpay account connection or use platform account
2. THE Payment_System SHALL create a Razorpay Order when a user initiates ticket purchase
3. WHEN payment is initiated, THE Payment_System SHALL display the Razorpay checkout modal
4. WHEN Razorpay sends a payment webhook, THE Payment_System SHALL verify the signature and update registration status
5. THE Payment_System SHALL calculate and display: ticket price, platform fee (3%), gateway fee (~2%), and net payout to organizer
6. THE Payment_System SHALL support "Pass fees to buyer" option where buyer pays ticket price + all fees
7. IF payment fails, THE Payment_System SHALL release the reserved ticket and notify the user
8. THE Payment_System SHALL support refund processing through the organizer dashboard

### Requirement 5: Registration Flow

**User Story:** As a user, I want to register for events with a smooth checkout experience, so that I can secure my spot quickly.

#### Acceptance Criteria

1. WHEN a user clicks "Register", THE Registration_Flow SHALL display available ticket types with prices and availability
2. WHEN the user selects a ticket, THE Registration_Flow SHALL display the custom registration form (if configured)
3. WHEN the user submits the form, THE Registration_Flow SHALL validate all required fields
4. IF the event is paid, THE Registration_Flow SHALL initiate payment checkout
5. WHEN registration is complete, THE Registration_Flow SHALL generate a unique registration ID and QR code
6. WHEN registration is complete, THE Registration_Flow SHALL send confirmation email with ticket details and QR code
7. THE Registration_Flow SHALL display the ticket in the user's profile under "My Events"

### Requirement 6: QR-Based Check-In System

**User Story:** As an event staff member, I want to scan attendee QR codes to mark attendance, so that I can efficiently manage event entry.

#### Acceptance Criteria

1. THE QR_System SHALL generate a signed QR token containing: event_id, registration_id, and HMAC signature
2. WHEN a Head or Volunteer opens the scanner, THE Scanner_Page SHALL activate the device camera
3. WHEN a QR code is scanned, THE Scanner_Page SHALL POST the token to the check-in API
4. THE Check_In_API SHALL verify the HMAC signature to prevent tampering
5. THE Check_In_API SHALL verify the ticket has not already been used (single-use)
6. IF check-in is successful, THE Scanner_Page SHALL display attendee name, ticket type, and "Checked In" confirmation
7. IF check-in fails (invalid/used QR), THE Scanner_Page SHALL display error message with reason
8. THE Scanner_Page SHALL maintain a scan history log with timestamps
9. THE Scanner_Page SHALL support offline mode with sync when connectivity is restored

### Requirement 7: Organizer Roles and Permissions

**User Story:** As an event creator, I want to assign different roles to team members, so that I can delegate responsibilities appropriately.

#### Acceptance Criteria

1. THE Role_System SHALL support four roles: Creator (owner), Co_Organizer, Head, Volunteer
2. THE Creator role SHALL have full permissions: edit event, manage tickets, process refunds, assign roles, export data, issue certificates, delete event
3. THE Co_Organizer role SHALL have permissions: edit event, manage tickets, process refunds, view attendees, send messages
4. THE Co_Organizer role SHALL NOT have permissions: assign roles, delete event, transfer ownership
5. THE Head role SHALL have permissions: scan QR codes, view attendee list (name and ticket type only), mark manual attendance
6. THE Head role SHALL NOT have permissions: export data, view contact information, edit event
7. THE Volunteer role SHALL have permissions: scan QR codes only
8. THE Volunteer role SHALL NOT have permissions: view attendee list, export data, edit event
9. WHEN assigning a role, THE Role_System SHALL allow search by username or email
10. THE Role_System SHALL send notification to users when assigned a role
11. THE Role_System SHALL log all role assignments and removals with timestamps

### Requirement 8: Certificate Generation

**User Story:** As an organizer, I want to issue certificates to attendees, so that they have proof of participation.

#### Acceptance Criteria

1. THE Certificate_System SHALL provide pre-designed certificate templates (A4 landscape)
2. THE Certificate_System SHALL support placeholders: {name}, {event_title}, {date}, {role}, {registration_id}
3. WHEN "Auto-issue on attendance" is enabled, THE Certificate_System SHALL generate certificates only for checked-in attendees after event ends
4. THE Certificate_System SHALL NOT issue certificates to users who did not check in (unless manually overridden)
5. THE Certificate_System SHALL generate certificates as PDF files
6. THE Certificate_System SHALL store issued certificates and make them accessible from user profile
7. THE Certificate_System SHALL support batch generation and email delivery
8. WHEN a user views their profile, THE Profile_Page SHALL display certificates under "Attended Events"
9. THE Organizer_Dashboard SHALL allow manual certificate issuance with reason logging

### Requirement 9: Custom Registration Form Builder

**User Story:** As an organizer, I want to collect custom information during registration, so that I can gather relevant attendee data.

#### Acceptance Criteria

1. THE Form_Builder SHALL support field types: text, number, email, phone, select (dropdown), radio, checkbox, file upload
2. THE Form_Builder SHALL allow marking fields as required or optional
3. THE Form_Builder SHALL support conditional logic (show field X if field Y equals Z)
4. WHEN a user registers, THE Registration_Flow SHALL display the custom form fields
5. THE Form_Builder SHALL store responses tied to the registration record
6. THE Organizer_Dashboard SHALL display form responses in the attendee list
7. THE Export_System SHALL include form responses in CSV export

### Requirement 10: Attendee Export and Analytics

**User Story:** As an organizer, I want to export attendee data and view event analytics, so that I can manage my event effectively.

#### Acceptance Criteria

1. THE Export_System SHALL generate CSV/Excel files with: name, email, phone, ticket_type, registration_id, payment_status, check_in_status, form_responses
2. THE Export_System SHALL restrict export access to Creator and Co_Organizer roles only
3. THE Analytics_Dashboard SHALL display: total registrations, check-ins, revenue, conversion rate (views → registrations)
4. THE Analytics_Dashboard SHALL display registration timeline chart (registrations over time)
5. THE Analytics_Dashboard SHALL display ticket type breakdown (pie chart)
6. THE Analytics_Dashboard SHALL display attendance percentage (checked-in / registered)
7. THE Analytics_Dashboard SHALL display waitlist conversion rate (if waitlist enabled)
8. THE Analytics_Dashboard SHALL display drop-off funnel: page views → registration started → registration completed

### Requirement 11: Event Lifecycle States

**User Story:** As an organizer, I want clear event states, so that I can manage the event lifecycle properly.

#### Acceptance Criteria

1. THE Event_System SHALL support states: Draft, Published, Registration_Closed, Ongoing, Completed, Cancelled, Archived
2. WHEN an event is in Draft state, THE Event_Page SHALL not be publicly visible
3. WHEN an event is Published, THE Event_Page SHALL accept registrations
4. WHEN registration deadline passes, THE Event_System SHALL transition to Registration_Closed state
5. WHEN event start time arrives, THE Event_System SHALL transition to Ongoing state
6. WHEN event end time passes, THE Event_System SHALL transition to Completed state
7. WHEN an organizer cancels an event, THE Event_System SHALL notify all registrants and process refunds for paid tickets

### Requirement 12: Notifications System

**User Story:** As a user, I want to receive notifications about my events, so that I stay informed about important updates.

#### Acceptance Criteria

1. WHEN a user registers for an event, THE Notification_System SHALL send registration confirmation
2. THE Notification_System SHALL send reminder 24 hours before event start
3. WHEN an event is updated (time/location change), THE Notification_System SHALL notify all registrants
4. WHEN an event is cancelled, THE Notification_System SHALL notify all registrants
5. WHEN a certificate is issued, THE Notification_System SHALL notify the attendee
6. THE Notification_System SHALL support email and in-app notification channels

### Requirement 13: Event Detail Page Redesign

**User Story:** As a user, I want a comprehensive event detail page, so that I can learn everything about an event before registering.

#### Acceptance Criteria

1. THE Event_Detail_Page SHALL display: cover image, title, description, date/time, venue/location, organizer info
2. THE Event_Detail_Page SHALL display ticket options with prices and availability
3. THE Event_Detail_Page SHALL display attendee count and capacity (if set)
4. THE Event_Detail_Page SHALL provide social share buttons (copy link, Twitter, WhatsApp)
5. THE Event_Detail_Page SHALL provide "Add to Calendar" button (ICS file download)
6. IF the user is registered, THE Event_Detail_Page SHALL display their ticket with QR code
7. IF the user is an organizer, THE Event_Detail_Page SHALL display management tabs (Attendees, Analytics, Settings)
8. THE Event_Detail_Page SHALL be responsive and work well on mobile devices

### Requirement 14: Dark Mode Support

**User Story:** As a user, I want the events pages to support dark mode, so that I have a consistent experience with the rest of the app.

#### Acceptance Criteria

1. THE Events_Page SHALL adapt colors to dark mode using the established color palette
2. THE Event_Detail_Page SHALL adapt colors to dark mode
3. THE Create_Wizard SHALL adapt colors to dark mode
4. THE Scanner_Page SHALL adapt colors to dark mode
5. IN dark mode, selected states SHALL use yellow background with black text
6. IN dark mode, non-selected states SHALL use grey text that turns white on hover

### Requirement 15: Waitlist System

**User Story:** As a user, I want to join a waitlist when tickets are sold out, so that I can still attend if a spot opens.

#### Acceptance Criteria

1. WHEN a ticket type is sold out, THE Registration_Page SHALL display "Join Waitlist" button
2. THE Waitlist_System SHALL store users in FIFO (first-in-first-out) order per ticket type
3. WHEN a ticket becomes available (cancellation/refund), THE Waitlist_System SHALL notify the next user in queue
4. THE notified user SHALL have 24 hours to claim the ticket
5. IF the user does not claim within the window, THE Waitlist_System SHALL automatically move to the next user
6. THE Waitlist_System SHALL be optional per event (organizer can enable/disable)
7. WHEN a user is on the waitlist, THE Event_Detail_Page SHALL display their waitlist position

### Requirement 16: Organizer Communication

**User Story:** As an organizer, I want to communicate with attendees and staff, so that I can share updates efficiently.

#### Acceptance Criteria

1. THE Organizer_Dashboard SHALL provide a "Send Message" feature
2. THE Organizer SHALL be able to target: all registrants, checked-in attendees only, volunteers only, heads only
3. Messages SHALL be delivered via email and in-app notification
4. THE Message_System SHALL log all sent messages for audit purposes
5. THE Message_System SHALL prevent spam by limiting to 3 messages per day per event
6. WHEN an event update is made (time/venue change), THE System SHALL prompt organizer to notify attendees

### Requirement 17: Attendance Rules Configuration

**User Story:** As an organizer, I want to define attendance rules, so that certificates and analytics are accurate.

#### Acceptance Criteria

1. THE Event_Settings SHALL allow configuring attendance mode: "Single Scan" (default) or "Entry + Exit Scan"
2. WHEN "Entry + Exit Scan" is enabled, THE Scanner_Page SHALL track both entry and exit times
3. THE Certificate_System SHALL only issue certificates to users who meet attendance requirements
4. THE Organizer_Dashboard SHALL allow manual attendance override with reason logging
5. THE Analytics_Dashboard SHALL display attendance percentage based on configured rules

### Requirement 18: Event Discovery and Engagement

**User Story:** As a user, I want to discover relevant events easily, so that I can find events that match my interests.

#### Acceptance Criteria

1. THE Events_Page SHALL display a "Featured" section for promoted events (admin-curated)
2. THE Events_Page SHALL display a "Trending" section based on registration velocity
3. THE Events_Page SHALL allow users to save/bookmark events for later
4. THE Event_Detail_Page SHALL display "Similar Events" recommendations based on category and campus
5. WHEN a user saves an event, THE System SHALL send a reminder 48 hours before registration closes
6. THE Events_Page SHALL support category filtering (Workshop, Hackathon, Cultural, Sports, etc.)

### Requirement 19: Role Permission Boundaries

**User Story:** As a platform, I want clear permission boundaries for each role, so that data access is properly controlled.

#### Acceptance Criteria

1. THE Creator role SHALL be the only role that can delete an event
2. THE Co_Organizer role SHALL NOT be able to assign or remove roles
3. THE Head role SHALL NOT be able to export attendee data
4. THE Volunteer role SHALL NOT be able to view attendee contact information (only name and ticket type on scan)
5. THE Volunteer role SHALL NOT be able to scan QR codes after event end time
6. THE Creator role SHALL NOT be able to remove themselves unless transferring ownership
7. WHEN a role is assigned, THE System SHALL log the assignment with timestamp and assigner
8. THE Organizer_Dashboard SHALL display role activity audit log

### Requirement 20: Multi-Day Events and Agenda Support

**User Story:** As an organizer, I want to create multi-day events with agenda blocks, so that I can manage conferences, hackathons, and festivals.

#### Acceptance Criteria

1. THE Event_System SHALL support events where start date differs from end date
2. THE Create_Wizard SHALL allow organizers to define one or more agenda blocks per day
3. FOR EACH agenda block, THE System SHALL store: day, start time, end time, title, description
4. THE Event_Detail_Page SHALL display the agenda clearly organized by day
5. THE Check_In_System SHALL consider attendance valid if check-in occurs on any valid event day
6. THE Analytics_Dashboard SHALL display attendance breakdown by day for multi-day events

### Requirement 21: No-Refund Policy

**User Story:** As a platform, I want to clearly communicate the no-refund policy, so that users understand before purchasing.

#### Acceptance Criteria

1. THE Event_Detail_Page SHALL display "This event does not support refunds" for paid events
2. THE Checkout_Page SHALL require user consent checkbox acknowledging no-refund policy
3. THE Registration_Confirmation SHALL include no-refund policy reminder
4. THE System SHALL NOT process any refunds in v1 (future enhancement)

### Requirement 22: Payment Responsibility Boundaries

**User Story:** As a platform, I want clear payment responsibility boundaries, so that legal and accounting complexity is minimized.

#### Acceptance Criteria

1. THE Payment_System SHALL treat Razorpay as the source of truth for payment success
2. THE System SHALL NOT hold money, manage settlements, or handle payouts
3. THE System SHALL only initiate Razorpay checkout and verify payment via webhook
4. THE System SHALL update registration state based on Razorpay webhook events
5. THE Payment_System SHALL use idempotency keys for Razorpay order creation
6. THE Payment_System SHALL handle webhook retries idempotently (same webhook = same result)

### Requirement 23: Data Retention and Privacy

**User Story:** As a platform, I want clear data retention rules, so that user privacy is protected and compliance is maintained.

#### Acceptance Criteria

1. THE System SHALL retain registration data for 14 days after event end
2. THE System SHALL allow users to request deletion of their registration data after event completion
3. THE System SHALL use soft delete for events and registrations
4. THE Certificate_System SHALL keep certificates accessible even after registration data is deleted
5. THE System SHALL retain audit logs for 90 days
6. THE Analytics_System SHALL store anonymized aggregate data indefinitely

### Requirement 24: Background Jobs and Queues

**User Story:** As a platform, I want reliable background job processing, so that async tasks complete reliably.

#### Acceptance Criteria

1. THE System SHALL use a job queue for certificate generation
2. THE System SHALL use a job queue for notification dispatch
3. THE System SHALL use a job queue for reminder scheduling
4. THE System SHALL implement retry logic with exponential backoff for failed jobs
5. THE System SHALL maintain a dead-letter queue for jobs that fail after max retries
6. THE System SHALL run a daily cleanup job to delete expired registration data

### Requirement 25: Failure Recovery and Handling

**User Story:** As a platform, I want explicit failure handling, so that edge cases don't cause data inconsistency.

#### Acceptance Criteria

1. IF Razorpay webhook is received but registration is missing, THE System SHALL log error and create alert
2. IF payment succeeds but frontend fails, THE System SHALL allow manual sync via "Verify Payment" button
3. IF QR scan fails, THE Scanner_Page SHALL offer manual override option (for Heads only)
4. THE System SHALL implement circuit breaker for external service calls (Razorpay, email)
5. THE System SHALL log all payment state transitions for audit

### Requirement 26: Non-Functional Requirements

**User Story:** As a platform, I want performance, security, and reliability guarantees, so that the system scales safely.

#### Acceptance Criteria

1. THE Events_Page SHALL load in under 300ms (cached)
2. THE Registration_API SHALL respond in under 500ms at p95
3. THE System SHALL rate limit registration attempts to 10 per minute per user
4. THE System SHALL rate limit QR scans to 60 per minute per scanner
5. THE System SHALL encrypt PII (email, phone) at rest
6. THE System SHALL support HMAC secret rotation without downtime
7. THE System SHALL emit structured logs for all payment and check-in operations
8. THE System SHALL alert on payment verification failures

### Requirement 27: Platform Admin Controls

**User Story:** As a platform admin, I want moderation tools, so that I can maintain platform quality.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL allow featuring/unfeaturing events
2. THE Admin_Dashboard SHALL allow disabling abusive events
3. THE Admin_Dashboard SHALL display payment disputes (from Razorpay)
4. THE Admin_Dashboard SHALL maintain admin action audit logs
5. THE System SHALL auto-publish campus events (no approval required in v1)
