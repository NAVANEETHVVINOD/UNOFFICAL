# Design Document: Events System Redesign

## Overview

This design document describes the architecture and implementation approach for the comprehensive Events System redesign. The system transforms LINKER's basic event functionality into a full-featured event management platform comparable to Luma/MakeMyPass, optimized for campus use cases.

The design follows a phased approach:
- **Phase 1**: Core event system with Global/Campus toggle, basic creation, and registration
- **Phase 2**: Paid events with Razorpay integration
- **Phase 3**: Roles, QR check-in, and attendance tracking
- **Phase 4**: Forms, export, and waitlist
- **Phase 5**: Certificates and notifications
- **Phase 6**: Analytics and polish

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  EventsPage    │  EventDetail  │  CreateWizard  │  Scanner      │
│  (listing)     │  (view/manage)│  (8 steps)     │  (PWA camera) │
└────────────────┴───────────────┴────────────────┴───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (NestJS)                            │
├─────────────────────────────────────────────────────────────────┤
│  EventsModule  │  TicketsModule │  PaymentsModule │ CheckInModule│
│  RolesModule   │  FormsModule   │  CertsModule    │ NotifyModule │
└────────────────┴────────────────┴─────────────────┴──────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Prisma)  │  Redis (locks/cache)  │  S3 (files)     │
└───────────────────────┴───────────────────────┴─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
├─────────────────────────────────────────────────────────────────┤
│  Razorpay (payments)  │  Email Service  │  PDF Generator        │
└───────────────────────┴─────────────────┴───────────────────────┘
```

## Components and Interfaces

### Frontend Components

#### 1. EventsPage Component
```typescript
interface EventsPageProps {
  initialScope: 'global' | 'campus';
}

interface EventFilters {
  scope: 'global' | 'campus';
  dateRange: 'today' | 'week' | 'month' | 'all';
  priceType: 'free' | 'paid' | 'all';
  category?: string;
  search?: string;
}

interface EventCard {
  id: string;
  title: string;
  coverUrl?: string;
  startsAt: Date;
  venue?: string;
  price: number; // 0 for free
  attendeeCount: number;
  capacity?: number;
  organizer: { name: string; avatarUrl?: string };
  isSaved: boolean;
}
```

#### 2. CreateEventWizard Component
```typescript
interface WizardStep {
  id: number;
  name: string;
  component: React.ComponentType;
  isComplete: boolean;
}

interface EventDraft {
  // Step 1: Basic Info
  title: string;
  description: string;
  coverUrl?: string;
  scope: 'global' | 'campus';
  category: string;
  visibility: 'public' | 'invite_only';
  
  // Step 2: When & Where
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  venue?: string;
  onlineLink?: string;
  
  // Step 3: Tickets
  tickets: TicketType[];
  isFree: boolean;
  
  // Step 4: Payment (if paid)
  razorpayAccountId?: string;
  passFeesToBuyer: boolean;
  
  // Step 5: Registration Form
  formSchema: FormField[];
  
  // Step 6: Roles
  roles: RoleAssignment[];
  
  // Step 7: Certificates
  certificateEnabled: boolean;
  certificateTemplateId?: string;
  autoIssueCertificate: boolean;
  
  // Step 8: Settings
  waitlistEnabled: boolean;
  attendanceMode: 'single_scan' | 'entry_exit';
}
```

#### 3. Scanner Component (PWA)
```typescript
interface ScannerProps {
  eventId: string;
  onScanSuccess: (result: CheckInResult) => void;
  onScanError: (error: string) => void;
}

interface CheckInResult {
  registrationId: string;
  attendeeName: string;
  ticketType: string;
  checkInTime: Date;
  isFirstScan: boolean;
}

interface ScanHistory {
  scans: ScanRecord[];
  pendingSync: ScanRecord[]; // For offline mode
}
```

### Backend Services

#### 1. Events Service
```typescript
interface EventsService {
  // CRUD
  create(data: CreateEventDto, userId: string): Promise<Event>;
  update(eventId: string, data: UpdateEventDto): Promise<Event>;
  delete(eventId: string): Promise<void>;
  
  // Queries
  findAll(filters: EventFilters, userId?: string): Promise<Event[]>;
  findOne(eventId: string): Promise<Event>;
  findByScope(scope: 'global' | 'campus', collegeId?: string): Promise<Event[]>;
  
  // Lifecycle
  publish(eventId: string): Promise<Event>;
  cancel(eventId: string, reason: string): Promise<Event>;
  archive(eventId: string): Promise<Event>;
}
```

#### 2. Tickets Service
```typescript
interface TicketsService {
  // Ticket Types
  createTicketType(eventId: string, data: CreateTicketDto): Promise<TicketType>;
  updateTicketType(ticketId: string, data: UpdateTicketDto): Promise<TicketType>;
  
  // Reservations (atomic)
  reserveTicket(ticketId: string, userId: string): Promise<Reservation>;
  confirmReservation(reservationId: string): Promise<Registration>;
  releaseReservation(reservationId: string): Promise<void>;
  
  // Availability
  getAvailability(ticketId: string): Promise<{ available: number; total: number }>;
}
```

#### 3. Payments Service
```typescript
interface PaymentsService {
  // Razorpay Integration
  createOrder(registrationId: string, amount: number): Promise<RazorpayOrder>;
  verifyPayment(orderId: string, paymentId: string, signature: string): Promise<boolean>;
  processWebhook(payload: RazorpayWebhook): Promise<void>;
  
  // Refunds
  initiateRefund(registrationId: string, amount?: number): Promise<Refund>;
  
  // Fee Calculation
  calculateFees(ticketPrice: number, passToUser: boolean): FeeBreakdown;
}

interface FeeBreakdown {
  ticketPrice: number;
  platformFee: number;      // 3%
  gatewayFee: number;       // ~2%
  totalCharge: number;      // What user pays
  organizerPayout: number;  // What organizer receives
}
```

#### 4. CheckIn Service
```typescript
interface CheckInService {
  // QR Generation
  generateQrToken(registrationId: string): Promise<{ token: string; qrDataUrl: string }>;
  
  // Verification
  verifyToken(token: string): Promise<{ valid: boolean; registrationId?: string }>;
  
  // Check-in
  checkIn(eventId: string, token: string, scannerId: string): Promise<CheckInResult>;
  
  // Manual Override
  manualCheckIn(eventId: string, registrationId: string, scannerId: string, reason: string): Promise<CheckInResult>;
}
```

#### 5. Roles Service
```typescript
interface RolesService {
  // Assignment
  assignRole(eventId: string, userId: string, role: EventRole, assignerId: string): Promise<void>;
  removeRole(eventId: string, userId: string, removerId: string): Promise<void>;
  
  // Queries
  getRoles(eventId: string): Promise<RoleAssignment[]>;
  getUserRole(eventId: string, userId: string): Promise<EventRole | null>;
  
  // Permission Check
  hasPermission(eventId: string, userId: string, action: EventAction): Promise<boolean>;
}

type EventRole = 'CREATOR' | 'CO_ORGANIZER' | 'HEAD' | 'VOLUNTEER';
type EventAction = 
  | 'EDIT_EVENT' | 'DELETE_EVENT' | 'MANAGE_TICKETS' 
  | 'PROCESS_REFUNDS' | 'ASSIGN_ROLES' | 'EXPORT_DATA'
  | 'SCAN_QR' | 'VIEW_ATTENDEES' | 'SEND_MESSAGES'
  | 'ISSUE_CERTIFICATES' | 'MANUAL_CHECKIN';
```

## Data Models

### Extended Prisma Schema

```prisma
model Event {
  id              String            @id @default(cuid())
  title           String
  description     String?
  coverUrl        String?
  startsAt        DateTime
  endsAt          DateTime
  timezone        String            @default("Asia/Kolkata")
  venue           String?
  onlineLink      String?
  
  // Scope & Visibility
  scope           EventScope        @default(COLLEGE)
  visibility      EventVisibility   @default(PUBLIC)
  category        String?
  
  // Lifecycle
  status          EventStatus       @default(DRAFT)
  
  // Settings
  waitlistEnabled Boolean           @default(false)
  attendanceMode  AttendanceMode    @default(SINGLE_SCAN)
  attendancePolicy String           @default("SINGLE_CHECKIN") // Future-proof
  noRefundPolicy  Boolean           @default(true)
  
  // Certificate
  certificateEnabled    Boolean     @default(false)
  certificateTemplateId String?
  autoIssueCertificate  Boolean     @default(false)
  
  // Soft delete
  deletedAt       DateTime?
  
  // Relations
  createdById     String
  collegeId       String?
  clubId          String?
  
  createdBy       User              @relation(fields: [createdById], references: [id])
  college         College?          @relation(fields: [collegeId], references: [id])
  club            Club?             @relation(fields: [clubId], references: [id])
  
  tickets         TicketType[]
  registrations   Registration[]
  roles           EventMemberRole[]
  formSchema      EventForm?
  waitlist        WaitlistEntry[]
  messages        EventMessage[]
  agendaBlocks    EventAgendaBlock[]
  
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  
  @@index([collegeId, startsAt])
  @@index([status, startsAt])
  @@index([deletedAt])
}

model EventAgendaBlock {
  id              String            @id @default(cuid())
  eventId         String
  day             Int               // Day number (1, 2, 3...)
  date            DateTime          // Actual date
  startTime       DateTime
  endTime         DateTime
  title           String
  description     String?
  
  event           Event             @relation(fields: [eventId], references: [id])
  
  @@index([eventId, day])
}

enum EventStatus {
  DRAFT
  PUBLISHED
  REGISTRATION_CLOSED
  ONGOING
  COMPLETED
  CANCELLED
  ARCHIVED
}

enum AttendanceMode {
  SINGLE_SCAN
  ENTRY_EXIT
}

model TicketType {
  id              String            @id @default(cuid())
  eventId         String
  name            String
  description     String?
  price           Int               @default(0) // In paise (INR cents)
  quantity        Int?              // null = unlimited
  quantitySold    Int               @default(0)
  perUserLimit    Int               @default(1)
  salesStart      DateTime?
  salesEnd        DateTime?
  
  event           Event             @relation(fields: [eventId], references: [id])
  registrations   Registration[]
  waitlist        WaitlistEntry[]
  
  @@index([eventId])
}

model Registration {
  id              String            @id @default(cuid())
  eventId         String
  ticketId        String
  userId          String
  
  // Status
  status          RegistrationStatus @default(PENDING)
  
  // Payment (if paid)
  paymentId       String?
  amountPaid      Int?
  platformFee     Int?
  gatewayFee      Int?
  
  // Check-in
  checkInTime     DateTime?
  checkOutTime    DateTime?
  checkInBy       String?
  checkInMethod   String?
  checkInDay      Int?              // For multi-day events
  
  // QR
  qrToken         String            @unique
  qrUsed          Boolean           @default(false)
  
  // Form Responses
  formResponses   Json?
  
  // Certificate
  certificateId   String?
  
  // Soft delete
  deletedAt       DateTime?
  
  // No-refund consent
  noRefundConsent Boolean           @default(false)
  
  event           Event             @relation(fields: [eventId], references: [id])
  ticket          TicketType        @relation(fields: [ticketId], references: [id])
  user            User              @relation(fields: [userId], references: [id])
  payment         Payment?
  certificate     Certificate?      @relation(fields: [certificateId], references: [id])
  
  createdAt       DateTime          @default(now())
  
  @@unique([eventId, userId])
  @@index([eventId, status])
  @@index([deletedAt])
}

enum RegistrationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  REFUNDED
  ATTENDED
}

model Payment {
  id                  String        @id @default(cuid())
  registrationId      String        @unique
  razorpayOrderId     String        @unique
  razorpayPaymentId   String?
  idempotencyKey      String        @unique // Prevent duplicate orders
  amount              Int
  platformFee         Int
  gatewayFee          Int
  status              PaymentStatus @default(PENDING)
  webhookProcessedAt  DateTime?     // Track webhook processing
  
  registration        Registration  @relation(fields: [registrationId], references: [id])
  
  createdAt           DateTime      @default(now())
  capturedAt          DateTime?
  
  @@index([idempotencyKey])
}

model PaymentWebhookLog {
  id                  String        @id @default(cuid())
  razorpayOrderId     String
  razorpayPaymentId   String?
  eventType           String
  payload             Json
  processedAt         DateTime      @default(now())
  
  @@index([razorpayOrderId])
}

enum PaymentStatus {
  PENDING
  CAPTURED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

model EventRole {
  id              String            @id @default(cuid())
  eventId         String
  userId          String
  role            RoleType
  assignedBy      String
  
  event           Event             @relation(fields: [eventId], references: [id])
  user            User              @relation(fields: [userId], references: [id])
  
  createdAt       DateTime          @default(now())
  
  @@unique([eventId, userId])
}

// Renamed for clarity
model EventMemberRole {
  id              String            @id @default(cuid())
  eventId         String
  userId          String
  role            RoleType
  assignedBy      String
  
  event           Event             @relation(fields: [eventId], references: [id])
  user            User              @relation(fields: [userId], references: [id])
  
  createdAt       DateTime          @default(now())
  
  @@unique([eventId, userId])
}

model BackgroundJob {
  id              String            @id @default(cuid())
  type            JobType
  payload         Json
  status          JobStatus         @default(PENDING)
  attempts        Int               @default(0)
  maxAttempts     Int               @default(3)
  lastError       String?
  scheduledFor    DateTime          @default(now())
  processedAt     DateTime?
  
  createdAt       DateTime          @default(now())
  
  @@index([type, status, scheduledFor])
}

enum JobType {
  CERTIFICATE_GENERATION
  NOTIFICATION_DISPATCH
  REMINDER_SEND
  DATA_CLEANUP
  WAITLIST_NOTIFY
}

enum JobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  DEAD_LETTER
}

model AdminAuditLog {
  id              String            @id @default(cuid())
  adminId         String
  action          String
  targetType      String            // 'event', 'user', etc.
  targetId        String
  reason          String?
  metadata        Json?
  
  createdAt       DateTime          @default(now())
  
  @@index([adminId])
  @@index([targetType, targetId])
}

enum RoleType {
  CREATOR
  CO_ORGANIZER
  HEAD
  VOLUNTEER
}

model WaitlistEntry {
  id              String            @id @default(cuid())
  eventId         String
  ticketId        String
  userId          String
  position        Int
  status          WaitlistStatus    @default(WAITING)
  notifiedAt      DateTime?
  expiresAt       DateTime?
  
  event           Event             @relation(fields: [eventId], references: [id])
  ticket          TicketType        @relation(fields: [ticketId], references: [id])
  user            User              @relation(fields: [userId], references: [id])
  
  createdAt       DateTime          @default(now())
  
  @@unique([eventId, ticketId, userId])
  @@index([eventId, ticketId, position])
}

enum WaitlistStatus {
  WAITING
  NOTIFIED
  CLAIMED
  EXPIRED
}

model EventForm {
  id              String            @id @default(cuid())
  eventId         String            @unique
  schema          Json              // Array of FormField
  
  event           Event             @relation(fields: [eventId], references: [id])
}

model Certificate {
  id              String            @id @default(cuid())
  eventId         String
  userId          String
  templateId      String
  fileUrl         String
  issuedAt        DateTime          @default(now())
  
  registrations   Registration[]
}

model EventMessage {
  id              String            @id @default(cuid())
  eventId         String
  senderId        String
  targetAudience  MessageAudience
  subject         String
  body            String
  
  event           Event             @relation(fields: [eventId], references: [id])
  
  createdAt       DateTime          @default(now())
}

enum MessageAudience {
  ALL_REGISTRANTS
  CHECKED_IN
  VOLUNTEERS
  HEADS
}
```

## Error Handling

### Error Codes
```typescript
enum EventErrorCode {
  // Event Errors
  EVENT_NOT_FOUND = 'EVENT_NOT_FOUND',
  EVENT_NOT_PUBLISHED = 'EVENT_NOT_PUBLISHED',
  EVENT_CANCELLED = 'EVENT_CANCELLED',
  EVENT_REGISTRATION_CLOSED = 'EVENT_REGISTRATION_CLOSED',
  
  // Ticket Errors
  TICKET_NOT_FOUND = 'TICKET_NOT_FOUND',
  TICKET_SOLD_OUT = 'TICKET_SOLD_OUT',
  TICKET_SALES_NOT_STARTED = 'TICKET_SALES_NOT_STARTED',
  TICKET_SALES_ENDED = 'TICKET_SALES_ENDED',
  TICKET_LIMIT_EXCEEDED = 'TICKET_LIMIT_EXCEEDED',
  
  // Registration Errors
  ALREADY_REGISTERED = 'ALREADY_REGISTERED',
  REGISTRATION_NOT_FOUND = 'REGISTRATION_NOT_FOUND',
  
  // Payment Errors
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_VERIFICATION_FAILED = 'PAYMENT_VERIFICATION_FAILED',
  REFUND_NOT_ALLOWED = 'REFUND_NOT_ALLOWED',
  
  // Check-in Errors
  INVALID_QR_TOKEN = 'INVALID_QR_TOKEN',
  QR_ALREADY_USED = 'QR_ALREADY_USED',
  NOT_REGISTERED = 'NOT_REGISTERED',
  
  // Permission Errors
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
}
```

## Testing Strategy

### Unit Tests
- Service methods for CRUD operations
- Fee calculation logic
- QR token generation and verification
- Permission checks for each role
- State machine transitions

### Property-Based Tests
- Ticket overselling prevention
- QR token round-trip (generate → parse → verify)
- Single-use QR enforcement
- Waitlist FIFO ordering
- Role permission matrix
- Event scope filtering
- Search result relevance

### Integration Tests
- Razorpay payment flow (using test keys)
- Registration → Payment → Confirmation flow
- Check-in flow with QR scanning
- Certificate generation

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Event Scope Filtering
*For any* set of events and any user with a college, filtering by "campus" scope SHALL return only events where event.collegeId equals user.collegeId, and filtering by "global" scope SHALL return all events with visibility "public".
**Validates: Requirements 1.2, 1.3**

### Property 2: Ticket Overselling Prevention
*For any* ticket type with a quantity limit N, the count of confirmed registrations SHALL never exceed N, even under concurrent registration attempts.
**Validates: Requirements 3.3**

### Property 3: QR Token Round-Trip
*For any* valid registration, generating a QR token and then parsing/verifying it SHALL return the original registration ID and event ID.
**Validates: Requirements 6.1**

### Property 4: QR Single-Use Enforcement
*For any* valid QR token, the first check-in attempt SHALL succeed, and all subsequent check-in attempts with the same token SHALL fail with "QR_ALREADY_USED" error.
**Validates: Requirements 6.5**

### Property 5: Role Permission Matrix
*For any* user with a role and any action, the permission check SHALL return true if and only if the action is in the role's allowed actions set, and SHALL return false for all actions in the role's denied actions set.
**Validates: Requirements 7.1-7.11, 19.1-19.7**

### Property 6: Event Lifecycle State Machine
*For any* event, state transitions SHALL only follow valid paths: DRAFT → PUBLISHED → REGISTRATION_CLOSED → ONGOING → COMPLETED → ARCHIVED, or PUBLISHED → CANCELLED at any point.
**Validates: Requirements 11.1-11.7**

### Property 7: Waitlist FIFO Ordering
*For any* waitlist with entries, when a ticket becomes available, the user with the lowest position number (earliest join time) SHALL be notified first.
**Validates: Requirements 15.2, 15.3**

### Property 8: Search Result Relevance
*For any* search query, all returned events SHALL contain the query string (case-insensitive) in at least one of: title, description, or venue.
**Validates: Requirements 1.6**

### Property 9: Fee Calculation Consistency
*For any* ticket price P, the sum of (organizerPayout + platformFee + gatewayFee) SHALL equal the totalCharge, and platformFee SHALL equal P * 0.03 (3%).
**Validates: Requirements 4.5**

### Property 10: Certificate Issuance Rules
*For any* event with auto-issue enabled, certificates SHALL only be issued to registrations where checkInTime is not null (user attended).
**Validates: Requirements 8.3, 8.4**

### Property 11: Ticket Availability Display
*For any* ticket type, the displayed status SHALL be: "Sold Out" if quantitySold >= quantity, "Sales start on [date]" if now < salesStart, "Sales ended" if now > salesEnd, otherwise available.
**Validates: Requirements 3.4, 3.5, 3.6**

### Property 12: Payment Webhook Idempotency
*For any* Razorpay webhook payload, processing the same webhook multiple times SHALL produce the same registration state as processing it once.
**Validates: Requirements 22.5, 22.6**

### Property 13: Registration Idempotency
*For any* user and event, attempting to register multiple times SHALL result in exactly one registration record.
**Validates: Requirements 5.1-5.7**

### Property 14: Multi-Day Attendance Validity
*For any* multi-day event, a check-in on any valid event day SHALL mark the registration as attended.
**Validates: Requirements 20.5**

### Property 15: Data Retention Compliance
*For any* registration older than 14 days after event end, the cleanup job SHALL soft-delete the registration while preserving certificates and anonymized analytics.
**Validates: Requirements 23.1, 23.4**
