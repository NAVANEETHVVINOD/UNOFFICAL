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

  <p align="center">
    <b>Connect. Collaborate. Campus.</b><br />
    A hyper-local, exclusive social network bridging the gap between students, events, and opportunities.
  </p>

</div>

---

## Production Status

| Component | Status |
|-----------|--------|
| Frontend Build | Passing |
| Backend Build | Passing |
| Frontend Tests | 290 tests passing |
| Backend Tests | 47 tests passing |
| PWA | Installable |

---

## Key Features

- Campus Dashboard with real-time feed
- Events with QR ticketing and check-in
- Classroom Management (LMS) for teachers
- Marketplace and Collaborations
- Real-time messaging with Socket.io
- Profile with social links and follow system

---

## User Roles and Access

| Role | Admin Panel | Features |
|------|-------------|----------|
| STUDENT | None | Feed, events, messaging, marketplace |
| FACULTY | `/classrooms` | Classroom management, attendance, assignments |
| CLUB_ADMIN | `/clubs/[id]/manage` | Member management, event creation |
| COLLEGE_ADMIN | `/admin/college` | Content moderation, event approvals |
| PLATFORM_ADMIN | `/admin/platform` | System analytics, user management |

---

## Tech Stack

- Frontend: Next.js 16, React 19, TailwindCSS, Framer Motion
- Backend: NestJS 10, Node.js, Socket.io
- Database: PostgreSQL 15, Prisma ORM
- Auth: JWT, Supabase Auth
- Monitoring: Sentry, Vercel Speed Insights

---

## Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL database

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

# Start development
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:4000

---

## Environment Variables

### Backend (apps/server/.env)
```env
DATABASE_URL="postgresql://..."
JWT_ACCESS_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
CORS_ORIGINS="http://localhost:3000"
SUPABASE_URL="https://..."
SUPABASE_SERVICE_KEY="..."
```

### Frontend (apps/web/.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

---

## Project Structure

```
LINKER/
├── apps/
│   ├── web/          # Next.js Frontend
│   └── server/       # NestJS Backend
├── packages/         # Shared packages
└── docs/             # Documentation
```

---

## Testing

```bash
# All tests
npm run test

# Frontend only
cd apps/web && npm run test

# Backend only
cd apps/server && npm run test
```

---

## Deployment

```bash
# Build
npm run build

# Start production
npm run start:prod
```

---

## License

MIT License - see LICENSE file

---

Made with love by the LINKER Team
