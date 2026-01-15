<div align="center">

  <img src="apps/web/public/icons/icon.svg" alt="LINKER Logo" width="120" height="120" />

  # LINKER
  ### The Campus Collective Super-App

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg?style=flat&logo=next.js)](https://nextjs.org/)
  [![NestJS](https://img.shields.io/badge/NestJS-10.0-red.svg?style=flat&logo=nestjs)](https://nestjs.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg?style=flat&logo=postgresql)](https://www.postgresql.org/)
  [![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8.svg?style=flat&logo=pwa)](https://web.dev/progressive-web-apps/)
  [![Tests](https://img.shields.io/badge/Tests-499%20passing-brightgreen.svg)](./apps/web/__tests__)

  <p align="center">
    <b>Connect. Collaborate. Campus.</b><br />
    A hyper-local, exclusive social network bridging the gap between students, events, and opportunities.
  </p>

</div>

---

## 🚀 Production Status

| Component | Status | Details |
|-----------|--------|---------|
| Frontend Build | ✅ Passing | Next.js 16 on Vercel |
| Backend Build | ✅ Passing | NestJS 10 on Render |
| Frontend Tests | ✅ 499 tests | Property-based + unit |
| Backend Tests | ✅ 47 tests | Service + controller |
| PWA | ✅ Installable | Offline support |
| Android TWA | ✅ Ready | Play Store ready |

---

## ✨ Key Features

### 📱 Core Platform
- **Campus Dashboard** - Real-time feed with posts, events, and announcements
- **Events System** - Full event management with ticketing, QR check-in, and certificates
- **Marketplace** - Buy/sell items within your campus community
- **Real-time Messaging** - Direct messages and group conversations via Socket.io
- **Study Notes** - Share and discover study materials

### 👨‍🏫 Teacher/Classroom (LMS)
- **Classroom Management** - Create and manage virtual classrooms
- **Assignments** - Create tasks with due dates and track submissions
- **Attendance** - Daily attendance marking with percentage tracking
- **Student Progress** - Monitor student performance and engagement

### 🎫 Events System
- **Multi-step Creation Wizard** - 8-step guided event creation
- **Ticket Types** - Free and paid tickets with quantity limits
- **Razorpay Payments** - Secure payment processing (optional)
- **QR Check-in** - HMAC-signed QR codes for secure attendance
- **Role Management** - Creator, Co-Organizer, Head, Volunteer roles
- **Certificates** - Auto-generate certificates for attendees
- **Analytics** - Registration trends, attendance rates, revenue

### 👥 Social Features
- **Follow System** - Follow users and see their content
- **Profile** - Education, experience, projects, social links
- **Clubs** - Join and manage campus clubs
- **Collaborations** - Find project partners

### 🔐 Admin Panels
- **Club Admin** - Member management, event creation
- **College Admin** - Content moderation, event approvals
- **Platform Admin** - System analytics, user management, feature flags

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      LINKER Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐           ┌────────────────┐            │
│  │   Frontend     │  REST/WS  │    Backend     │            │
│  │   (Vercel)     │◄─────────►│    (Render)    │            │
│  │                │           │                │            │
│  │  Next.js 16    │           │  NestJS 10     │            │
│  │  React 19      │           │  Prisma ORM    │            │
│  │  TailwindCSS   │           │  Socket.io     │            │
│  └───────┬────────┘           └───────┬────────┘            │
│          │                            │                      │
│  ┌───────▼────────┐           ┌───────▼────────┐            │
│  │   Supabase     │           │   PostgreSQL   │            │
│  │  (Auth/Files)  │           │   (Database)   │            │
│  └────────────────┘           └────────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 👤 User Roles

| Role | Admin Panel | Key Features |
|------|-------------|--------------|
| STUDENT | None | Feed, events, messaging, marketplace, notes |
| FACULTY | `/classrooms` | Classroom management, attendance, assignments |
| CLUB_ADMIN | `/clubs/[id]/manage` | Member management, event creation |
| COLLEGE_ADMIN | `/admin/college` | Content moderation, event approvals |
| PLATFORM_ADMIN | `/admin/platform` | System analytics, user management |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TailwindCSS, Framer Motion |
| Backend | NestJS 10, Node.js, Socket.io |
| Database | PostgreSQL 15, Prisma ORM |
| Auth | JWT, Supabase Auth |
| Storage | Supabase Storage |
| Payments | Razorpay (optional) |
| Monitoring | Sentry |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL database (or Supabase)
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/NAVANEETHVVINOD/UNOFFICAL.git
cd UNOFFICAL

# Install dependencies
npm install

# Generate Prisma client
cd apps/server && npx prisma generate

# Run migrations
npx prisma migrate deploy

# Return to root
cd ../..

# Start development
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

---

## ⚙️ Environment Variables

### Backend (`apps/server/.env`)
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
JWT_ACCESS_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# CORS
CORS_ORIGINS="http://localhost:3000"

# Supabase
SUPABASE_URL="https://..."
SUPABASE_SERVICE_KEY="..."

# Razorpay (optional - payments disabled if not set)
RAZORPAY_KEY_ID="rzp_..."
RAZORPAY_KEY_SECRET="..."

# Sentry (optional)
SENTRY_DSN="https://..."
```

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

---

## 📁 Project Structure

```
LINKER/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── app/               # App Router pages & components
│   │   ├── lib/               # Utilities & API client
│   │   ├── public/            # Static assets & PWA icons
│   │   └── __tests__/         # Property-based tests
│   │
│   └── server/                # NestJS Backend
│       ├── src/modules/       # Feature modules
│       ├── src/common/        # Shared utilities
│       └── prisma/            # Database schema
│
├── packages/                  # Shared packages
├── docs/                      # Documentation
└── .kiro/specs/              # Feature specifications
```

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Frontend tests only
cd apps/web && npm run test

# Backend tests only
cd apps/server && npm run test

# Run specific test file
cd apps/web && npm run test -- --testPathPattern="events"
```

### Test Coverage
- **499 frontend tests** - Property-based tests using fast-check
- **47 backend tests** - Unit tests for services and controllers
- **15 correctness properties** - Events system validation
- **Security tests** - WebSocket auth, CORS, error sanitization

---

## 🚢 Deployment

### Vercel (Frontend)
- Auto-deploys from `main` branch
- Environment variables configured in Vercel dashboard

### Render (Backend)
- Uses `render.yaml` configuration
- Health check endpoint: `/health`

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

---

## 📱 Android App (TWA)

The platform is ready for Android deployment via Trusted Web Activity:

```bash
# See build instructions
cat ANDROID_BUILD.md

# TWA configuration
cat twa-manifest.json
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | Detailed implementation status |
| [PLATFORM_AUDIT.md](./PLATFORM_AUDIT.md) | Complete API & page inventory |
| [ANDROID_BUILD.md](./ANDROID_BUILD.md) | TWA build instructions |
| [PLAY_STORE_LISTING.md](./PLAY_STORE_LISTING.md) | Play Store content |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment guide |

---

## 🔒 Security

- JWT authentication with refresh tokens
- WebSocket authentication
- CORS with whitelisted origins
- Error response sanitization
- Rate limiting
- HMAC-signed QR tokens
- Idempotent webhook processing
- Sentry monitoring with PII scrubbing

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

---

<div align="center">
  <p>Made with ❤️ by the LINKER Team</p>
</div>
