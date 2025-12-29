# Implementation Plan: Events System Redesign

## Overview

This implementation plan transforms LINKER's basic event functionality into a comprehensive event management platform. The plan follows a phased approach to ensure incremental delivery of value while maintaining system stability.

**Implementation Language**: TypeScript (Next.js frontend, NestJS backend)
**Testing Framework**: Jest with fast-check for property-based testing

## Tasks

- [x] 1. Database Schema and Core Event System
  - [x] 1.1 Create Prisma schema migrations for events system
    - Add Event model with scope, visibility, status, and settings fields
    - Add TicketType model with pricing and quantity fields
    - Add Registration model with status and QR token fields
    - Add EventRole model for role assignments
    - Add WaitlistEntry model
    - Add EventForm model for custom registration forms
    - Add Certificate model
    - Add EventMessage model
    - Add Payment model for Razorpay integration
    - Create indexes for efficient queries
    - _Requirements: 2.1-2.11, 3.1-3.7, 11.1-11.7_

  - [x] 1.2 Implement EventsService core CRUD operations
    - Create event with draft status
    - Update event details
    - Delete event (creator only)
    - Find events with filters (scope, date, price, category, search)
    - Publish event (transition from draft)
    - _Requirements: 1.1-1.8, 2.1-2.11_

  - [x] 1.3 Write property test for event scope filtering
    - **Property 1: Event Scope Filtering**
    - **Validates: Requirements 1.2, 1.3**

  - [x] 1.4 Write property test for search result relevance
    - **Property 8: Search Result Relevance**
    - **Validates: Requirements 1.6**

- [x] 2. Events Page Frontend (Global/Campus Toggle)
  - [x] 2.1 Create EventsPage component with scope toggle
    - Implement Global/Campus toggle with Campus as default
    - Add date range filter (Today, This Week, This Month, All)
    - Add price type filter (Free, Paid, All)
    - Add category filter dropdown
    - Add search input with debounce
    - Implement dark mode support
    - _Requirements: 1.1-1.8, 14.1_

  - [x] 2.2 Create EventCard component
    - Display cover image, title, date/time, venue
    - Display price (or "Free"), attendee count, organizer
    - Add save/bookmark button
    - Implement dark mode styling
    - _Requirements: 1.7, 18.3_

  - [x] 2.3 Implement Featured and Trending sections
    - Display admin-curated featured events
    - Calculate and display trending events by registration velocity
    - _Requirements: 18.1, 18.2_

- [x] 3. Release Gate - Core Events System
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Event Creation Wizard (Multi-Step Form)
  - [x] 4.1 Create wizard framework with step navigation
    - Implement progress indicator
    - Enable back/forward navigation without data loss
    - Implement auto-save at each step
    - _Requirements: 2.9, 2.10, 2.11_

  - [x] 4.2 Implement Step 1: Basic Info
    - Title, description, cover image upload
    - Campus/Global scope toggle
    - Category selection
    - Public/Invite-only visibility
    - _Requirements: 2.1_

  - [x] 4.3 Implement Step 2: When & Where
    - Date/time picker with timezone
    - Venue input or online link
    - _Requirements: 2.2_

  - [x] 4.4 Implement Step 3: Tickets & Pricing
    - Add/remove ticket types
    - Set name, price, quantity, per-user limit
    - Set sales start/end dates
    - Free event toggle
    - _Requirements: 2.3, 3.1, 3.2_

  - [x] 4.5 Implement Step 4: Payment Setup (conditional)
    - Display only for paid events
    - Razorpay account connection UI
    - Fee breakdown display
    - "Pass fees to buyer" toggle
    - _Requirements: 2.4, 4.1, 4.5, 4.6_

  - [x] 4.6 Implement Step 5: Registration Form Builder
    - Add field types: text, number, email, phone, select, radio, checkbox, file
    - Mark fields as required/optional
    - Implement conditional logic builder
    - _Requirements: 2.5, 9.1-9.3_

  - [x] 4.7 Implement Step 6: Roles & Volunteers
    - Search users by username/email
    - Assign Co-organizer, Head, Volunteer roles
    - _Requirements: 2.6, 7.9_

  - [x] 4.8 Implement Step 7: Certificates
    - Template selection UI
    - Auto-issue toggle
    - _Requirements: 2.7, 8.1, 8.3_

  - [x] 4.9 Implement Step 8: Review & Publish
    - Event preview
    - Share options (copy link, social)
    - Publish button
    - _Requirements: 2.8_

- [x] 5. Release Gate - Event Creation Wizard
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Ticket System and Registration Flow
  - [x] 6.1 Implement TicketsService with atomic reservation
    - Create/update ticket types
    - Reserve ticket with Redis lock
    - Confirm/release reservation
    - Get availability
    - _Requirements: 3.1-3.7_

  - [x] 6.2 Write property test for ticket overselling prevention
    - **Property 2: Ticket Overselling Prevention**
    - **Validates: Requirements 3.3**

  - [x] 6.3 Write property test for ticket availability display
    - **Property 11: Ticket Availability Display**
    - **Validates: Requirements 3.4, 3.5, 3.6**

  - [x] 6.4 Create Registration Flow frontend
    - Display available tickets with prices and status
    - Show custom registration form
    - Validate required fields
    - Generate registration ID and QR code on completion
    - _Requirements: 5.1-5.7_

  - [x] 6.5 Implement registration confirmation
    - Send confirmation email with ticket details
    - Display ticket in user's "My Events"
    - _Requirements: 5.6, 5.7_

- [x] 7. Release Gate - Ticket System
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Payment Processing with Razorpay
  - [x] 8.1 Implement PaymentsService
    - Create Razorpay order
    - Verify payment signature
    - Process webhook events
    - Calculate fee breakdown
    - _Requirements: 4.1-4.8_

  - [x] 8.2 Write property test for fee calculation consistency
    - **Property 9: Fee Calculation Consistency**
    - **Validates: Requirements 4.5**

  - [x] 8.3 Create Razorpay checkout integration
    - Display Razorpay modal
    - Handle success/failure callbacks
    - Update registration status
    - _Requirements: 4.3, 4.4, 4.7_

  - [x] 8.4 Implement refund processing
    - Note: v1 does not support refunds per spec
    - Refund initiation from organizer dashboard (future)
    - Razorpay refund API integration (implemented in PaymentsService)
    - Update registration status to REFUNDED (implemented)
    - _Requirements: 4.8_

- [x] 9. Release Gate - Payment System
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Roles and Permissions System
  - [x] 10.1 Implement RolesService
    - Assign/remove roles
    - Get user role for event
    - Check permission for action
    - Log role changes with timestamps
    - Prevent volunteer scanning after event end
    - _Requirements: 7.1-7.11, 19.1-19.7_

  - [x] 10.2 Write property test for role permission matrix
    - **Property 5: Role Permission Matrix**
    - **Validates: Requirements 7.1-7.11, 19.1-19.7**

  - [x] 10.3 Create role management UI in organizer dashboard
    - Search and assign users
    - Display current role assignments
    - Show role activity audit log
    - _Requirements: 7.9, 7.11, 19.6, 19.7_

- [x] 11. QR-Based Check-In System
  - [x] 11.1 Implement CheckInService
    - Generate signed QR token with HMAC
    - Verify token signature
    - Process check-in (single-use enforcement)
    - Support manual check-in with reason
    - _Requirements: 6.1-6.9_

  - [x] 11.2 Write property test for QR token round-trip
    - **Property 3: QR Token Round-Trip**
    - **Validates: Requirements 6.1**

  - [x] 11.3 Write property test for QR single-use enforcement
    - **Property 4: QR Single-Use Enforcement**
    - **Validates: Requirements 6.5**

  - [x] 11.4 Create Scanner Page (PWA)
    - Camera activation and QR scanning
    - Display scan result (success/error)
    - Maintain scan history log
    - Implement offline mode with sync
    - Dark mode support
    - _Requirements: 6.2-6.9, 14.4_

  - [x] 11.5 Implement Entry + Exit scan mode
    - Track both entry and exit times
    - Update attendance analytics
    - _Requirements: 17.1, 17.2_

- [x] 12. Release Gate - Roles and Check-In
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Event Lifecycle State Machine
  - [x] 13.1 Implement event state transitions
    - DRAFT → PUBLISHED
    - PUBLISHED → REGISTRATION_CLOSED (auto on deadline)
    - REGISTRATION_CLOSED → ONGOING (auto on start time)
    - ONGOING → COMPLETED (auto on end time)
    - PUBLISHED → CANCELLED (manual)
    - COMPLETED → ARCHIVED (manual)
    - _Requirements: 11.1-11.7_

  - [x] 13.2 Write property test for event lifecycle state machine
    - **Property 6: Event Lifecycle State Machine**
    - **Validates: Requirements 11.1-11.7**

  - [x] 13.3 Implement cancellation flow
    - Notify all registrants
    - Process refunds for paid tickets
    - _Requirements: 11.7_

- [x] 14. Waitlist System
  - [x] 14.1 Implement WaitlistService
    - Add user to waitlist (FIFO)
    - Notify next user when ticket available
    - Process claim/expiry
    - _Requirements: 15.1-15.7_

  - [x] 14.2 Write property test for waitlist FIFO ordering
    - **Property 7: Waitlist FIFO Ordering**
    - **Validates: Requirements 15.2, 15.3**

  - [x] 14.3 Create waitlist UI
    - "Join Waitlist" button when sold out
    - Display waitlist position
    - Claim ticket notification
    - _Requirements: 15.1, 15.7_

- [x] 15. Release Gate - Lifecycle and Waitlist
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Custom Registration Forms
  - [x] 16.1 Implement FormService
    - Store form schema per event
    - Validate form responses
    - Store responses with registration
    - _Requirements: 9.1-9.7_

  - [x] 16.2 Create form builder UI
    - Drag-and-drop field ordering
    - Field type selection
    - Required/optional toggle
    - Conditional logic configuration
    - _Requirements: 9.1-9.4_

  - [x] 16.3 Display form responses in attendee list
    - Show responses in organizer dashboard
    - Include in CSV export
    - _Requirements: 9.6, 9.7_

- [x] 17. Export System
  - [x] 17.1 Implement ExportService
    - Generate CSV with attendee data
    - Include form responses
    - Restrict to Creator/Co-Organizer
    - _Requirements: 10.1, 10.2_

  - [x] 17.2 Create export UI in organizer dashboard
    - Export button with format selection
    - Download generated file
    - _Requirements: 10.1_

- [x] 18. Certificate Generation
  - [x] 18.1 Implement CertificateService
    - Load certificate templates
    - Replace placeholders with data
    - Generate PDF
    - Store and serve certificates
    - _Requirements: 8.1-8.9_

  - [x] 18.2 Write property test for certificate issuance rules
    - **Property 10: Certificate Issuance Rules**
    - **Validates: Requirements 8.3, 8.4**

  - [x] 18.3 Create certificate management UI
    - Template selection in wizard
    - Manual issuance with reason
    - Batch generation
    - _Requirements: 8.1, 8.7, 8.9_

  - [x] 18.4 Display certificates in user profile
    - List certificates under "Attended Events"
    - Download PDF
    - _Requirements: 8.6, 8.8_

- [x] 19. Release Gate - Forms, Export, Certificates
  - Ensure all tests pass, ask the user if questions arise.

- [x] 20. Notifications System
  - [x] 20.1 Implement NotificationService for events
    - Registration confirmation
    - 24-hour reminder
    - Event update notifications
    - Cancellation notifications
    - Certificate issuance notification
    - _Requirements: 12.1-12.6_

  - [x] 20.2 Implement organizer messaging
    - Send message to target audience
    - Email and in-app delivery
    - Message logging
    - Rate limiting (3/day/event)
    - _Requirements: 16.1-16.6_

- [x] 21. Analytics Dashboard
  - [x] 21.1 Implement AnalyticsService
    - Calculate total registrations, check-ins, revenue
    - Calculate conversion rate
    - Generate registration timeline data
    - Calculate ticket type breakdown
    - Calculate attendance percentage
    - Calculate waitlist conversion rate
    - Generate drop-off funnel data
    - _Requirements: 10.3-10.8_

  - [x] 21.2 Create analytics dashboard UI
    - Display key metrics cards
    - Registration timeline chart
    - Ticket type pie chart
    - Attendance percentage
    - Drop-off funnel visualization
    - _Requirements: 10.3-10.8_

- [x] 22. Event Detail Page Redesign
  - [x] 22.1 Redesign EventDetailPage
    - Display cover image, title, description, date/time, venue
    - Display ticket options with availability
    - Display attendee count and capacity
    - Social share buttons
    - "Add to Calendar" button (ICS download)
    - Dark mode support
    - _Requirements: 13.1-13.8, 14.2_

  - [x] 22.2 Implement registered user view
    - Display ticket with QR code
    - _Requirements: 13.6_

  - [x] 22.3 Implement organizer view
    - Management tabs (Attendees, Analytics, Settings)
    - _Requirements: 13.7_

  - [x] 22.4 Implement Similar Events recommendations
    - Based on category and campus
    - _Requirements: 18.4_

- [x] 23. Event Discovery Features
  - [x] 23.1 Implement event bookmarking
    - Save/unsave events
    - Display saved events in profile
    - Send reminder 48 hours before registration closes
    - _Requirements: 18.3, 18.5_

  - [x] 23.2 Implement category filtering
    - Workshop, Hackathon, Cultural, Sports, etc.
    - _Requirements: 18.6_

- [x] 24. Final Release Gate - Complete System
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all 15 correctness properties pass
  - Review dark mode consistency across all pages
  - Test mobile responsiveness

- [x] 25. Multi-Day Events and Agenda Support
  - [x] 25.1 Add EventAgendaBlock model to Prisma schema
    - Add day, date, startTime, endTime, title, description fields
    - Create index on eventId and day
    - _Requirements: 20.1-20.6_

  - [x] 25.2 Implement agenda editor in Create Wizard (Step 2.5)
    - Add/remove agenda blocks per day
    - Set time slots and titles
    - _Requirements: 20.2, 20.3_

  - [x] 25.3 Display agenda on Event Detail Page
    - Organize by day with clear timeline
    - _Requirements: 20.4_

  - [x] 25.4 Update check-in to support multi-day attendance
    - Track which day check-in occurred
    - Mark attendance valid for any event day
    - _Requirements: 20.5_

  - [x] 25.5 Write property test for multi-day attendance validity
    - **Property 14: Multi-Day Attendance Validity**
    - **Validates: Requirements 20.5**

  - [x] 25.6 Update analytics for multi-day breakdown
    - Show attendance per day
    - _Requirements: 20.6_

- [x] 26. Release Gate - Multi-Day Events
  - Ensure all tests pass, ask the user if questions arise.

- [x] 27. No-Refund Policy Implementation
  - [x] 27.1 Add no-refund policy display on Event Detail Page
    - Show "This event does not support refunds" for paid events
    - _Requirements: 21.1_

  - [x] 27.2 Add consent checkbox on Checkout Page
    - Require acknowledgment before payment
    - Store consent in registration record
    - _Requirements: 21.2_

  - [x] 27.3 Include no-refund reminder in confirmation email
    - _Requirements: 21.3_

- [x] 28. Payment System Hardening
  - [x] 28.1 Implement idempotency keys for Razorpay orders
    - Generate unique key per registration attempt
    - Prevent duplicate order creation
    - _Requirements: 22.5_

  - [x] 28.2 Implement idempotent webhook processing
    - Log all webhooks to PaymentWebhookLog
    - Skip already-processed webhooks
    - _Requirements: 22.6_

  - [x] 28.3 Write property test for payment webhook idempotency
    - **Property 12: Payment Webhook Idempotency**
    - **Validates: Requirements 22.5, 22.6**

  - [x] 28.4 Write property test for registration idempotency
    - **Property 13: Registration Idempotency**
    - **Validates: Requirements 5.1-5.7**

  - [x] 28.5 Add "Verify Payment" manual sync button
    - For cases where frontend fails after payment success
    - _Requirements: 25.2_

- [x] 29. Release Gate - Payment Hardening
  - Ensure all tests pass, ask the user if questions arise.

- [x] 30. Data Retention and Cleanup
  - [x] 30.1 Add soft delete fields to Event and Registration models
    - Add deletedAt field with index
    - Update queries to filter soft-deleted records
    - _Requirements: 23.3_

  - [x] 30.2 Implement BackgroundJob model and queue system
    - Create job types enum
    - Implement retry with exponential backoff
    - Implement dead-letter queue
    - _Requirements: 24.1-24.5_

  - [x] 30.3 Implement daily data cleanup job
    - Soft-delete registrations older than 14 days after event end
    - Preserve certificates and anonymized analytics
    - _Requirements: 23.1, 24.6_

  - [x] 30.4 Write property test for data retention compliance
    - **Property 15: Data Retention Compliance**
    - **Validates: Requirements 23.1, 23.4**

  - [x] 30.5 Implement user data deletion request
    - Allow users to request deletion after event
    - _Requirements: 23.2_

- [x] 31. Failure Recovery and Handling
  - [x] 31.1 Implement webhook-without-registration alert
    - Log error when webhook received for missing registration
    - Create admin alert
    - _Requirements: 25.1_

  - [x] 31.2 Implement circuit breaker for external services
    - Razorpay API calls
    - Email service calls
    - _Requirements: 25.4_

  - [x] 31.3 Add payment state transition logging
    - Log all status changes for audit
    - _Requirements: 25.5_

  - [x] 31.4 Add manual check-in override for Heads
    - Fallback when QR scan fails
    - Require reason logging
    - _Requirements: 25.3_

- [x] 32. Release Gate - Reliability
  - Ensure all tests pass, ask the user if questions arise.

- [x] 33. Non-Functional Requirements
  - [x] 33.1 Implement rate limiting
    - 10 registration attempts per minute per user
    - 60 QR scans per minute per scanner
    - _Requirements: 26.3, 26.4_

  - [x] 33.2 Add PII encryption at rest
    - Encrypt email and phone fields
    - _Requirements: 26.5_

  - [x] 33.3 Implement HMAC secret rotation support
    - Support multiple active secrets during rotation
    - _Requirements: 26.6_

  - [x] 33.4 Add structured logging for payments and check-ins
    - Include correlation IDs
    - _Requirements: 26.7_

  - [x] 33.5 Implement payment failure alerts
    - Alert on verification failures
    - _Requirements: 26.8_

  - [x] 33.6 Add performance monitoring
    - Track Events page load time
    - Track Registration API response time
    - _Requirements: 26.1, 26.2_

- [x] 34. Platform Admin Controls
  - [x] 34.1 Create Admin Dashboard for events
    - Feature/unfeature events
    - Disable abusive events
    - _Requirements: 27.1, 27.2_

  - [x] 34.2 Display payment disputes from Razorpay
    - _Requirements: 27.3_

  - [x] 34.3 Implement admin audit logging
    - Log all admin actions
    - _Requirements: 27.4_

- [x] 35. Final Release Gate - Production Ready
  - Ensure all 15 correctness properties pass
  - Verify rate limiting works correctly
  - Test failure recovery scenarios
  - Review admin controls
  - Confirm data retention job runs correctly

## Notes

- All property-based tests are required and validate correctness properties from the design document
- Each phase builds on the previous, ensuring incremental delivery
- Release Gates ensure system stability before proceeding
- All UI components must support dark mode with the established color palette
- Property tests should run minimum 100 iterations each
- Analytics calculations MUST NOT block user-facing flows (eventually consistent)
- Razorpay is the source of truth for payment success - LINKER only verifies and updates state
- No refunds in v1 - users must consent to this policy before purchase
- Data retention: 14 days after event end, certificates preserved indefinitely
