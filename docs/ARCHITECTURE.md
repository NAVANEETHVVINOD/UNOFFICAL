# College Connect - Architecture Overview

## Page Structure & Component Architecture

### 1. Authentication & Onboarding

#### Pages

```
apps/web/src/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── register/
│   │   └── page.tsx              # Registration page
│   └── forgot-password/
│       └── page.tsx              # Password reset page
└── onboarding/
    └── page.tsx                  # Profile completion wizard
```

#### Components

- `AuthForm` - Reusable form component for auth flows
- `SocialAuthButtons` - Social login options
- `ProfileSetup` - Multi-step profile completion wizard
- `CollegeSearch` - College selection autocomplete
- `VerificationStatus` - Email verification status indicator

#### Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String?
  role          UserRole  @default(STUDENT)
  verified      Boolean   @default(false)
  profile       Profile?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Profile {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  college       String
  year          Int
  major         String
  bio           String?
  avatar        String?
  social        Json?     // Social media links
  interests     String[]
}
```

### 2. Dashboard & Navigation

#### Pages

```
apps/web/src/app/
└── (dashboard)/
    ├── page.tsx                  # Main dashboard
    ├── layout.tsx               # Dashboard layout with nav
    ├── notifications/
    │   └── page.tsx             # Notifications center
    └── search/
        └── page.tsx             # Global search
```

#### Components

- `Sidebar` - Main navigation sidebar
- `NotificationBell` - Real-time notification indicator
- `QuickActions` - Frequently used actions menu
- `SearchBar` - Global search component
- `ActivityFeed` - Recent activity timeline

### 3. Clubs Module

#### Pages

```
apps/web/src/app/(dashboard)/clubs/
├── page.tsx                      # Clubs listing
├── create/
│   └── page.tsx                 # Create new club
├── [clubId]/
│   ├── page.tsx                 # Club details
│   ├── members/
│   │   └── page.tsx            # Members management
│   ├── events/
│   │   └── page.tsx            # Club events
│   └── settings/
│       └── page.tsx            # Club settings
```

#### Components

- `ClubCard` - Club preview card
- `ClubHeader` - Club page header with cover
- `MembersList` - Members management
- `EventCalendar` - Club events calendar
- `ClubForm` - Club creation/edit form

#### Database Schema

```prisma
model Club {
  id          String    @id @default(cuid())
  name        String
  description String
  cover       String?
  members     ClubMember[]
  events      Event[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model ClubMember {
  id          String    @id @default(cuid())
  userId      String
  clubId      String
  role        ClubRole  @default(MEMBER)
  joinedAt    DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
  club        Club      @relation(fields: [clubId], references: [id])
}
```

### 4. Events Module

#### Pages

```
apps/web/src/app/(dashboard)/events/
├── page.tsx                      # Events listing
├── create/
│   └── page.tsx                 # Create new event
└── [eventId]/
    ├── page.tsx                 # Event details
    └── attendees/
        └── page.tsx            # Attendee management
```

#### Components

- `EventCard` - Event preview card
- `EventDetails` - Event information display
- `AttendeesList` - Event attendees management
- `RSVPButton` - RSVP functionality
- `EventForm` - Event creation form

#### Database Schema

```prisma
model Event {
  id          String    @id @default(cuid())
  title       String
  description String
  startDate   DateTime
  endDate     DateTime
  location    String?
  clubId      String?
  club        Club?     @relation(fields: [clubId], references: [id])
  attendees   EventAttendee[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model EventAttendee {
  id          String    @id @default(cuid())
  userId      String
  eventId     String
  status      RSVPStatus
  user        User      @relation(fields: [userId], references: [id])
  event       Event     @relation(fields: [eventId], references: [id])
}
```

### 5. Marketplace Module

#### Pages

```
apps/web/src/app/(dashboard)/marketplace/
├── page.tsx                      # Listings page
├── create/
│   └── page.tsx                 # Create listing
├── [listingId]/
│   └── page.tsx                 # Listing details
└── messages/
    └── [userId]/
        └── page.tsx            # Buyer-seller chat
```

#### Components

- `ListingCard` - Product listing card
- `ListingGallery` - Product images gallery
- `ChatInterface` - Buyer-seller messaging
- `ListingForm` - Create/edit listing form
- `PriceFilter` - Price range filter

#### Database Schema

```prisma
model Listing {
  id          String    @id @default(cuid())
  title       String
  description String
  price       Float
  condition   Condition
  category    Category
  images      String[]
  sellerId    String
  seller      User      @relation(fields: [sellerId], references: [id])
  messages    Message[]
  status      ListingStatus @default(ACTIVE)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Message {
  id          String    @id @default(cuid())
  content     String
  senderId    String
  listingId   String
  sender      User      @relation(fields: [senderId], references: [id])
  listing     Listing   @relation(fields: [listingId], references: [id])
  createdAt   DateTime  @default(now())
}
```

### 6. Study Materials Module

#### Pages

```
apps/web/src/app/(dashboard)/study/
├── page.tsx                      # Materials listing
├── upload/
│   └── page.tsx                 # Upload materials
├── [materialId]/
│   ├── page.tsx                 # Material details
│   └── versions/
│       └── page.tsx            # Version history
└── subjects/
    └── [subjectId]/
        └── page.tsx            # Subject materials
```

#### Components

- `MaterialCard` - Study material preview
- `SubjectFilter` - Subject filtering
- `UploadForm` - Material upload form
- `VersionHistory` - Material versions
- `PDFViewer` - Document preview

#### Database Schema

```prisma
model StudyMaterial {
  id          String    @id @default(cuid())
  title       String
  description String
  subject     String
  type        MaterialType
  file        String
  versions    MaterialVersion[]
  uploaderId  String
  uploader    User      @relation(fields: [uploaderId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model MaterialVersion {
  id          String    @id @default(cuid())
  version     Int
  file        String
  materialId  String
  material    StudyMaterial @relation(fields: [materialId], references: [id])
  uploaderId  String
  uploader    User      @relation(fields: [uploaderId], references: [id])
  createdAt   DateTime  @default(now())
}
```

## UI Component Library

```
packages/ui/src/components/
├── core/                       # Base components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── ...
├── forms/                      # Form components
│   ├── Form.tsx
│   ├── Select.tsx
│   ├── FileUpload.tsx
│   └── ...
├── layout/                     # Layout components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── Container.tsx
│   └── ...
└── feedback/                   # Feedback components
    ├── Toast.tsx
    ├── Alert.tsx
    ├── Progress.tsx
    └── ...
```

## Third-party Libraries

1. **Core Libraries**
   - `next`: Frontend framework
   - `react`: UI library
   - `prisma`: Database ORM
   - `@trpc/client`: API client
   - `@trpc/server`: API server

2. **UI/UX Libraries**
   - `framer-motion`: Animations
   - `tailwindcss`: Styling
   - `@radix-ui/react`: Accessible components
   - `react-hook-form`: Form handling
   - `zod`: Schema validation

3. **Data Management**
   - `tanstack-query`: Data fetching
   - `zustand`: State management
   - `date-fns`: Date handling
   - `react-dropzone`: File uploads

4. **Media Handling**
   - `next-cloudinary`: Image handling
   - `react-pdf`: PDF preview
   - `sharp`: Image optimization

5. **Authentication**
   - `next-auth`: Authentication
   - `bcrypt`: Password hashing
   - `jose`: JWT handling

## Development Process

1. Set up UI component library first
2. Implement authentication flows
3. Create base layout and navigation
4. Build feature modules one by one:
   - Clubs
   - Events
   - Marketplace
   - Study Materials
5. Add real-time features
6. Implement search and notifications
7. Polish UI/UX and animations

## Backend Architecture

```
apps/server/src/modules/
├── auth/                      # Authentication
├── users/                     # User management
├── clubs/                     # Clubs module
├── events/                    # Events module
├── marketplace/              # Marketplace module
├── study/                    # Study materials
├── chat/                     # Real-time chat
└── search/                   # Global search
```

## API Routes Structure

```
apps/web/src/app/api/
├── auth/
│   ├── login
│   ├── register
│   └── verify
├── users/
│   └── [id]/
├── clubs/
│   └── [clubId]/
├── events/
│   └── [eventId]/
├── marketplace/
│   └── [listingId]/
└── study/
    └── [materialId]/
```
