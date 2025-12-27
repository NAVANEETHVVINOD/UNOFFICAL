# Design Document: Teacher Classroom & Admin Views Enhancement

## Overview

This design document outlines the comprehensive enhancement of the LINKER platform to include Teacher/Classroom management features (Google Classroom-like functionality), consolidated admin views for all roles, dashboard consolidation, and navigation improvements. The implementation will add new modules for classroom management while refactoring existing components for better consistency and user experience.

### Design Principles

1. **Role-Based Experience**: Each user role (Student, Teacher, Club Admin, College Admin, Platform Admin) gets a tailored interface
2. **Consistency**: Navigation, styling, and interactions remain consistent across all pages
3. **Professional UI/UX**: Clean, modern design with proper hierarchy and spacing
4. **Mobile-First**: All features work seamlessly on mobile devices
5. **Scalability**: Architecture supports future feature additions

## Architecture

### Frontend Architecture

```
apps/web/
├── app/
│   ├── classrooms/                    # Teacher Classroom Module (NEW)
│   │   ├── page.tsx                   # Classroom dashboard
│   │   ├── create/page.tsx            # Create classroom
│   │   ├── [id]/
│   │   │   ├── page.tsx               # Classroom detail
│   │   │   ├── assignments/page.tsx   # Assignments list
│   │   │   ├── attendance/page.tsx    # Attendance management
│   │   │   └── students/page.tsx      # Student management
│   ├── collabo/                       # Collaboration Page (NEW)
│   │   ├── page.tsx                   # Collaboration listing
│   │   └── create/page.tsx            # Create collaboration
│   ├── admin/
│   │   ├── club/page.tsx              # Club Admin dashboard
│   │   ├── college/page.tsx           # College Admin dashboard (ENHANCED)
│   │   └── platform/page.tsx          # Platform Admin dashboard (ENHANCED)
│   ├── components/
│   │   ├── classroom/                 # Classroom components (NEW)
│   │   │   ├── ClassroomCard.tsx
│   │   │   ├── AssignmentCard.tsx
│   │   │   ├── AttendanceTable.tsx
│   │   │   └── StudentProgress.tsx
│   │   ├── collabo/                   # Collaboration components (NEW)
│   │   │   ├── CollaborationCard.tsx
│   │   │   └── CollaborationForm.tsx
│   │   ├── navigation/
│   │   │   ├── DiscoverMenu.tsx       # Grouped navigation (NEW)
│   │   │   ├── BottomNav.tsx          # Updated mobile nav (5 items)
│   │   │   └── NavBox.tsx             # Consistent nav box component (4 items desktop)
│   │   ├── dashboard/
│   │   │   ├── EventsSection.tsx      # Integrated events (NEW)
│   │   │   └── CollegeAbout.tsx       # College about page (NEW)
│   │   ├── feed/
│   │   │   └── PostVisibility.tsx     # Visibility selector (NEW)
│   │   └── ui/
│   │       └── Skeleton.tsx           # Enhanced skeleton loaders (NO spinners)
│   ├── colleges/
│   │   └── [slug]/
│   │       └── about/page.tsx         # College about page (NEW)
│   └── explore/
│       └── page.tsx                   # Updated explore page
```

### Backend Architecture

```
apps/server/
├── src/
│   ├── modules/
│   │   ├── classrooms/                # Classroom Module (NEW)
│   │   │   ├── classrooms.controller.ts
│   │   │   ├── classrooms.service.ts
│   │   │   ├── classrooms.module.ts
│   │   │   └── dto/
│   │   │       ├── create-classroom.dto.ts
│   │   │       └── create-assignment.dto.ts
│   │   ├── attendance/                # Attendance Module (NEW)
│   │   │   ├── attendance.controller.ts
│   │   │   ├── attendance.service.ts
│   │   │   └── attendance.module.ts
│   │   └── posts/
│   │       └── posts.service.ts       # Updated for visibility
```

### Database Schema Extensions

```prisma
// New models for Classroom feature
model Classroom {
  id          String   @id @default(cuid())
  name        String
  description String?
  subject     String
  teacherId   String
  teacher     User     @relation("TeacherClassrooms", fields: [teacherId], references: [id])
  students    ClassroomStudent[]
  assignments Assignment[]
  attendance  AttendanceRecord[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ClassroomStudent {
  id          String    @id @default(cuid())
  classroomId String
  classroom   Classroom @relation(fields: [classroomId], references: [id])
  studentId   String
  student     User      @relation(fields: [studentId], references: [id])
  enrolledAt  DateTime  @default(now())
  
  @@unique([classroomId, studentId])
}

model Assignment {
  id          String   @id @default(cuid())
  title       String
  description String?
  dueDate     DateTime
  points      Int      @default(0)
  classroomId String
  classroom   Classroom @relation(fields: [classroomId], references: [id])
  submissions AssignmentSubmission[]
  attachments String[]
  createdAt   DateTime @default(now())
}

model AssignmentSubmission {
  id           String     @id @default(cuid())
  assignmentId String
  assignment   Assignment @relation(fields: [assignmentId], references: [id])
  studentId    String
  student      User       @relation(fields: [studentId], references: [id])
  status       SubmissionStatus @default(PENDING)
  submittedAt  DateTime?
  verifiedAt   DateTime?
  verifiedBy   String?
  
  @@unique([assignmentId, studentId])
}

model AttendanceRecord {
  id          String    @id @default(cuid())
  classroomId String
  classroom   Classroom @relation(fields: [classroomId], references: [id])
  studentId   String
  student     User      @relation(fields: [studentId], references: [id])
  date        DateTime
  status      AttendanceStatus
  markedAt    DateTime  @default(now())
  markedBy    String
  
  @@unique([classroomId, studentId, date])
}

enum SubmissionStatus {
  PENDING
  SUBMITTED
  VERIFIED
  REJECTED
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
}

// Update Post model for visibility
model Post {
  // ... existing fields
  visibility  PostVisibility @default(PUBLIC)
}

enum PostVisibility {
  PUBLIC
  FRIENDS_ONLY
  COLLEGE_ONLY
}
```

## Components and Interfaces

### 1. Classroom Management

```typescript
// Classroom interfaces
interface Classroom {
  id: string;
  name: string;
  description?: string;
  subject: string;
  teacherId: string;
  teacher: User;
  studentCount: number;
  assignmentCount: number;
  createdAt: Date;
}

interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  points: number;
  classroomId: string;
  attachments: string[];
  submissions: AssignmentSubmission[];
}

interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  student: User;
  status: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  submittedAt?: Date;
  verifiedAt?: Date;
}

// ClassroomCard component props
interface ClassroomCardProps {
  classroom: Classroom;
  onView: () => void;
  onEdit?: () => void;
}
```

### 2. Attendance System

```typescript
interface AttendanceRecord {
  id: string;
  classroomId: string;
  studentId: string;
  student: User;
  date: Date;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  markedAt: Date;
}

interface AttendanceTableProps {
  classroomId: string;
  students: User[];
  date: Date;
  onMarkAttendance: (studentId: string, status: AttendanceStatus) => void;
}

interface StudentAttendanceStats {
  studentId: string;
  classroomId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  percentage: number;
}
```

### 3. Resource Naming Convention

```typescript
// Utility function for resource filename formatting
function formatResourceFilename(
  subjectName: string,
  username: string,
  originalFilename: string
): string {
  const extension = originalFilename.split('.').pop();
  const sanitizedSubject = subjectName.replace(/[^a-zA-Z0-9]/g, '');
  const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '');
  return `${sanitizedSubject}_${sanitizedUsername}.${extension}`;
}
```

### 4. Post Visibility

```typescript
type PostVisibility = 'PUBLIC' | 'FRIENDS_ONLY' | 'COLLEGE_ONLY';

interface PostVisibilitySelectorProps {
  value: PostVisibility;
  onChange: (visibility: PostVisibility) => void;
}

// Visibility icons mapping
const visibilityIcons = {
  PUBLIC: Globe,
  FRIENDS_ONLY: Users,
  COLLEGE_ONLY: Building,
};
```

### 5. Grouped Navigation (Discover Menu)

```typescript
interface DiscoverMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  href: string;
}

const discoverMenuItems: DiscoverMenuItem[] = [
  { id: 'events', label: 'Events', icon: Calendar, href: '/events' },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, href: '/marketplace' },
  { id: 'resources', label: 'Resources', icon: BookOpen, href: '/resources' },
];

interface DiscoverMenuProps {
  isExpanded: boolean;
  onToggle: () => void;
}
```

### 6. Consistent NavBox Component

```typescript
interface NavBoxProps {
  icon: React.ComponentType;
  label: string;
  href: string;
  isActive?: boolean;
  badge?: number;
  size?: 'sm' | 'md' | 'lg';
}

// Consistent sizing across all pages
const navBoxSizes = {
  sm: 'w-16 h-16',
  md: 'w-20 h-20',
  lg: 'w-24 h-24',
};
```

### 7. College About Page

```typescript
interface CollegeAboutData {
  id: string;
  name: string;
  description: string;
  departments: string[];
  initiatives: string[];
  website?: string;
  foundedYear?: number;
  studentCount?: number;
  announcements: CollegeAnnouncement[];
}

interface CollegeAnnouncement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: User;
}
```

### 8. Updated Bottom Navigation

```typescript
interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  activeIcon: React.ComponentType;
  href: string;
}

// Mobile Bottom Nav - 5 items
const bottomNavItems: BottomNavItem[] = [
  { id: 'home', label: 'Home', icon: Home, activeIcon: HomeFilled, href: '/dashboard' },
  { id: 'college', label: 'College', icon: Building, activeIcon: BuildingFilled, href: '/my-college' },
  { id: 'explore', label: 'Explore', icon: Compass, activeIcon: CompassFilled, href: '/explore' },
  { id: 'chat', label: 'Chat', icon: MessageCircle, activeIcon: MessageCircleFilled, href: '/messages' },
  { id: 'post', label: 'Post', icon: PlusCircle, activeIcon: PlusCircleFilled, href: '#create' },
];

// Desktop Nav Box - 4 items (separate from Explore)
const desktopNavItems: BottomNavItem[] = [
  { id: 'home', label: 'Home', icon: Home, activeIcon: HomeFilled, href: '/dashboard' },
  { id: 'college', label: 'College', icon: Building, activeIcon: BuildingFilled, href: '/my-college' },
  { id: 'explore', label: 'Explore', icon: Compass, activeIcon: CompassFilled, href: '/explore' },
  { id: 'chat', label: 'Chat', icon: MessageCircle, activeIcon: MessageCircleFilled, href: '/messages' },
];
```

### 9. Collaboration Page

```typescript
interface Collaboration {
  id: string;
  title: string;
  description: string;
  skillsNeeded: string[];
  deadline?: Date;
  authorId: string;
  author: User;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  responses: CollaborationResponse[];
  createdAt: Date;
}

interface CollaborationResponse {
  id: string;
  collaborationId: string;
  userId: string;
  user: User;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
}
```

### 10. Grid Background Pattern

```css
/* Grid pattern for main content background */
.bg-grid-subtle {
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### 11. Campus Selection Persistence

```typescript
// Enhanced onboarding guard with backend verification
async function verifyCollegeSelection(userId: string): Promise<boolean> {
  const response = await fetch(`/api/users/${userId}`);
  const user = await response.json();
  return !!user.profile?.collegeId;
}

// Onboarding guard hook
export function useOnboardingGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && user) {
      // Check both local state and backend
      const checkCollege = async () => {
        const hasCollege = await verifyCollegeSelection(user.id);
        if (!hasCollege) {
          router.replace('/onboarding?step=college');
        }
      };
      checkCollege();
    }
  }, [user, loading, router]);
}
```

### 12. Skeleton Loading System

```typescript
// Remove all spinner/loading screen components
// Use only skeleton loaders that match page structure

interface SkeletonProps {
  variant: 'card' | 'list' | 'profile' | 'feed' | 'table';
  count?: number;
}

// Page-specific skeleton configurations
const skeletonConfigs = {
  dashboard: ['profile', 'feed', 'feed', 'feed'],
  classroom: ['card', 'card', 'table'],
  messages: ['list', 'list', 'list'],
  explore: ['card', 'card', 'card', 'card'],
};
```

### 13. WebSocket Authentication Service

```typescript
// apps/server/src/common/services/ws-auth.service.ts
interface WsAuthService {
  verifyToken(token: string): Promise<JwtPayload | null>;
  extractTokenFromSocket(client: Socket): string | null;
  authenticateSocket(client: Socket): Promise<AuthenticatedSocket | null>;
}

interface AuthenticatedSocket extends Socket {
  userId: string;
  email: string;
}

interface JwtPayload {
  sub: string;      // User ID
  email: string;
  role: Role;
  iat: number;
  exp: number;
}
```

### 14. CORS Configuration

```typescript
// apps/server/src/config/cors.config.ts
interface CorsConfig {
  getAllowedOrigins(): string[];
  isOriginAllowed(origin: string): boolean;
}

// Environment variables:
// CORS_ORIGINS=https://linker.app,https://staging.linker.app
```

### 15. Sanitized Exception Filter

```typescript
// apps/server/src/common/filters/all-exceptions.filter.ts
interface SanitizedErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
  // NO auth headers, tokens, or stack traces in production
}
```

### 16. Cursor Pagination Interface

```typescript
// Shared pagination types
interface CursorPaginationParams {
  cursor?: string;    // ID of last item
  limit?: number;     // Default 20, max 100
  direction?: 'forward' | 'backward';
}

interface CursorPaginatedResponse<T> {
  data: T[];
  meta: {
    hasMore: boolean;
    nextCursor: string | null;
    prevCursor: string | null;
    total?: number;
  };
}
```

### 17. Save Post API

```typescript
// POST /posts/:id/save
// DELETE /posts/:id/save
interface SavePostResponse {
  saved: boolean;
  postId: string;
}

// GET /users/me/saved
interface SavedItemsResponse {
  posts: Post[];
  events: Event[];
  notes: Note[];
  listings: MarketplaceListing[];
}
```

### 18. Follow System API

```typescript
// POST /users/:id/follow
// DELETE /users/:id/follow
interface FollowResponse {
  following: boolean;
  followerId: string;
  followingId: string;
}

// GET /users/:id/followers
// GET /users/:id/following
interface FollowListResponse {
  users: UserProfile[];
  total: number;
  hasMore: boolean;
  nextCursor: string | null;
}
```

### 19. Direct Messaging API

```typescript
// POST /conversations/direct
interface CreateDirectConversationDto {
  participantId: string;  // User to message
  initialMessage?: string;
}

interface ConversationResponse {
  id: string;
  participants: UserProfile[];
  lastMessage?: Message;
  createdAt: string;
  type: 'direct' | 'listing';
}
```

### 20. Database Performance Indexes

```prisma
// Add to schema.prisma
model Post {
  // ... existing fields
  @@index([authorId])
  @@index([collegeId])
  @@index([createdAt(sort: Desc)])
  @@index([collegeId, createdAt(sort: Desc)])
  @@index([visibility, createdAt(sort: Desc)])
}

model Event {
  // ... existing fields
  @@index([collegeId])
  @@index([startsAt])
  @@index([collegeId, startsAt])
}

model Message {
  // ... existing fields
  @@index([conversationId])
  @@index([conversationId, createdAt])
}

model Notification {
  // ... existing fields
  @@index([userId])
  @@index([userId, read])
  @@index([userId, createdAt(sort: Desc)])
}
```

## Data Models

### Teacher Role Extension

```typescript
// Extend User model for teacher capabilities
interface TeacherUser extends User {
  role: 'TEACHER';
  classrooms: Classroom[];
  canViewAnonymousPosts: false; // Teachers cannot see anonymous posts
}
```

### Events Section Integration

```typescript
interface DashboardEventsSection {
  upcomingEvents: Event[];
  pastEvents: Event[];
  filters: {
    type: 'all' | 'college' | 'global';
    dateRange?: { start: Date; end: Date };
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Resource Filename Format
*For any* resource uploaded by a teacher or student, the stored filename SHALL follow the format "SubjectName_Username.extension" where special characters are removed from subject and username.
**Validates: Requirements 3.1, 3.2, 3.4**

### Property 2: Teacher Anonymous Post Filtering
*For any* feed viewed by a user with TEACHER role, the feed SHALL NOT contain any posts where isAnonymous is true.
**Validates: Requirements 4.1**

### Property 3: College-Only Post Visibility
*For any* post with visibility set to COLLEGE_ONLY, the post SHALL only be visible to users whose collegeId matches the post author's collegeId.
**Validates: Requirements 5.2, 5.5**

### Property 4: Post Visibility Indicator
*For any* post displayed in the feed, the post card SHALL display a visibility indicator icon corresponding to its visibility setting (globe for PUBLIC, users for FRIENDS_ONLY, building for COLLEGE_ONLY).
**Validates: Requirements 5.4**

### Property 5: Event College Filter
*For any* event filter set to "College Events", the filtered results SHALL only contain events where the event's collegeId matches the current user's collegeId.
**Validates: Requirements 6.2**

### Property 6: Past Events Section
*For any* event where the end date is before the current date, the event SHALL appear in the "Past Events" section and SHALL display attendance count.
**Validates: Requirements 6.3**

### Property 7: College Event Badge
*For any* event that has a collegeId set, the event card SHALL display a college badge with the college name.
**Validates: Requirements 6.4**

### Property 8: College About Page Data
*For any* college About page view, the page SHALL display the college name, description, and at least one of: departments list or initiatives list.
**Validates: Requirements 8.2**

### Property 9: Nav Box Size Consistency
*For any* page displaying nav boxes, all nav boxes SHALL have identical dimensions (width and height) within the same viewport size category.
**Validates: Requirements 9.1, 9.3**

### Property 10: Ticker Tilt Consistency
*For any* page displaying the carousel/ticker, the ticker SHALL have a CSS transform with rotation applied (non-zero rotate value).
**Validates: Requirements 9.2**

### Property 11: Explore Page Sections
*For any* explore page view, the page SHALL display all four sections: Campus Events, Student Clubs, Marketplace, and Resources.
**Validates: Requirements 11.2**

### Property 12: Explore Category Navigation
*For any* category card clicked on the explore page, the system SHALL navigate to the correct corresponding page (/events, /clubs, /marketplace, or /resources).
**Validates: Requirements 11.3**

### Property 13: Bottom Nav Items
*For any* mobile view (viewport width < 768px), the bottom navigation SHALL display exactly five items: Home, College, Explore, Chat, and Post.
**Validates: Requirements 15.2**

### Property 14: Bottom Nav Active State
*For any* page in the application, the bottom navigation item corresponding to the current route SHALL have a visually distinct active state (different color or fill).
**Validates: Requirements 15.4**

### Property 15: Assignment Submission Status
*For any* assignment view by a teacher, each enrolled student SHALL have a visible submission status (PENDING, SUBMITTED, VERIFIED, or REJECTED).
**Validates: Requirements 1.5**

### Property 16: Attendance Percentage Calculation
*For any* student with attendance records, the attendance percentage SHALL equal (presentDays + lateDays * 0.5) / totalDays * 100, rounded to one decimal place.
**Validates: Requirements 2.3, 2.5**

### Property 17: Attendance Date Filter
*For any* attendance history filter with a date range, the returned records SHALL only include records where the date falls within the specified range (inclusive).
**Validates: Requirements 2.4**

### Property 18: Club Admin Member Management
*For any* club admin managing their club, the system SHALL allow adding members, removing members, and changing member roles without affecting other clubs.
**Validates: Requirements 12.2**

### Property 19: College Admin Content Moderation
*For any* content moderation action by a college admin, the action SHALL only affect content within their college (posts, events, users from their college).
**Validates: Requirements 13.2, 13.3**

### Property 20: Platform Admin User Management
*For any* user management action by a platform admin, the system SHALL allow changing user roles to any valid role and issuing/lifting bans.
**Validates: Requirements 14.3**

### Property 21: Desktop Nav Box Layout
*For any* desktop view (viewport width >= 768px), the nav box SHALL display exactly four items: Home, College, Explore, Chat (Campus NOT merged with Explore).
**Validates: Requirements 16.1, 16.2**

### Property 22: Campus Selection Backend Persistence
*For any* user who completes college selection in onboarding, the collegeId SHALL be stored in the backend user profile and retrievable via API.
**Validates: Requirements 21.1, 21.2**

### Property 23: Campus Selection Redirect
*For any* page access by a user without a collegeId in their profile, the system SHALL redirect to /onboarding?step=college.
**Validates: Requirements 21.3, 21.4**

### Property 24: Skeleton Loading Only
*For any* loading state in the application, the system SHALL display skeleton loaders matching the page structure and SHALL NOT display spinner or full-screen loading overlays.
**Validates: Requirements 18.1, 18.2**

### Property 25: Post Creation No Sell Option
*For any* post creation modal state, the marketplace/sell option SHALL NOT be available as a post type.
**Validates: Requirements 19.1**

### Property 26: Grid Background Application
*For any* main content area, the background SHALL have a subtle grid pattern applied via CSS.
**Validates: Requirements 20.1**

### Property 27: WebSocket Authentication Verification
*For any* WebSocket connection attempt with a JWT token, the gateway SHALL extract the user ID from the verified token payload, and that user ID SHALL match the user ID stored in the authenticated socket context.
**Validates: Requirements 23.1, 23.3, 23.5**

### Property 28: Invalid Authentication Rejection
*For any* WebSocket connection attempt with an invalid, expired, or missing JWT token, the gateway SHALL reject the connection and emit an authentication error event before disconnecting.
**Validates: Requirements 23.2, 23.4**

### Property 29: CORS Origin Validation
*For any* HTTP request from an origin not in the whitelist, the server SHALL respond with a 403 Forbidden status when CORS is enforced.
**Validates: Requirements 24.1, 24.2**

### Property 30: Error Response Sanitization
*For any* error response in production mode, the response body SHALL NOT contain authorization headers, JWT tokens, or internal stack traces.
**Validates: Requirements 25.1, 25.2, 25.3, 25.4**

### Property 31: Cursor Pagination Correctness
*For any* paginated request with a cursor, all returned items SHALL have a creation timestamp less than or equal to the cursor item's timestamp, and the returned nextCursor SHALL point to the last item in the response.
**Validates: Requirements 26.1, 26.2, 26.3**

### Property 32: Save Post Round-Trip
*For any* post and user, saving the post then querying saved posts SHALL include that post, and unsaving then querying SHALL NOT include that post.
**Validates: Requirements 27.1, 27.2, 27.3**

### Property 33: Follow Relationship Round-Trip
*For any* two users A and B, when A follows B then unfollows B, the follow relationship SHALL be created then removed, and B's follower count SHALL increment then decrement accordingly.
**Validates: Requirements 28.1, 28.2, 28.3, 28.4**

### Property 34: Follow Notification Generation
*For any* follow action, a notification of type FOLLOW SHALL be created for the followed user with the follower's ID as the actor.
**Validates: Requirements 28.5**

### Property 35: Direct Conversation Creation
*For any* two users, creating a direct conversation SHALL succeed without requiring a marketplace listing, and the conversation SHALL include both users as participants.
**Validates: Requirements 29.1, 29.2**

### Property 36: Real-Time Message Delivery
*For any* message sent in a conversation, all connected participants in that conversation's room SHALL receive the message via WebSocket broadcast.
**Validates: Requirements 29.3**

### Property 37: Sentry Error Capture
*For any* unhandled exception in production, Sentry.captureException SHALL be called with the error and context, and the context SHALL NOT contain PII fields (email, full name, phone).
**Validates: Requirements 31.2, 31.5**

## Error Handling

### Classroom Errors
- Classroom not found: Display "Classroom not found" with redirect to classroom list
- Unauthorized access: Display "You don't have permission to view this classroom"
- Assignment creation failure: Show inline validation errors

### Attendance Errors
- Duplicate attendance: Prevent marking attendance twice for same student/date
- Invalid date: Prevent marking attendance for future dates
- Network failure: Queue attendance locally and sync when online

### Visibility Errors
- College not set: Prevent selecting COLLEGE_ONLY if user has no college
- Invalid visibility: Default to PUBLIC if invalid value received

## Testing Strategy

### Property-Based Testing Library
**Library:** `fast-check` (TypeScript PBT library)

**Configuration:**
- Minimum 100 iterations per property test
- Seed logging for reproducibility

### Test Categories

**Unit Tests:**
- Component rendering with various props
- Form validation logic
- Utility function correctness (filename formatting)
- Role-based UI rendering

**Property-Based Tests:**
- Visibility filtering correctness
- Attendance calculation accuracy
- Navigation consistency
- Filter correctness

### Test File Structure

```
apps/web/__tests__/
├── properties/
│   ├── classroom.property.test.ts
│   ├── attendance.property.test.ts
│   ├── visibility.property.test.ts
│   ├── navigation.property.test.ts
│   └── admin.property.test.ts
└── unit/
    ├── ClassroomCard.test.tsx
    ├── AttendanceTable.test.tsx
    ├── PostVisibility.test.tsx
    └── BottomNav.test.tsx
```

### Property Test Annotation Format

Each property-based test MUST include:
```typescript
/**
 * **Feature: teacher-classroom-admin-views, Property N: Property Title**
 * **Validates: Requirements X.Y**
 */
```
