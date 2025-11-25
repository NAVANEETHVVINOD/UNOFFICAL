# 🎓 LINKER - The Campus Collective

> **Connect. Learn. Live.** - Events, Clubs, Notes & Chaos — Organized.

[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black)](https://linker-inky.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7)](https://linker-backend-wx4i.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](https://github.com/NAVANEETHVVINOD/UNOFFICAL)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## 🌟 Overview

**LINKER** is a comprehensive social platform designed specifically for college students. It's your one-stop hub for campus life - manage clubs, discover events, buy/sell items, share study materials, and connect with your college community.

### **Live Demo**
- 🌐 **Frontend**: [linker-inky.vercel.app](https://linker-inky.vercel.app)
- 🔧 **Backend API**: [linker-backend-wx4i.onrender.com](https://linker-backend-wx4i.onrender.com)

### **Why LINKER?**
- 🎨 **Beautiful UI** - Unique "Newspaper/Retro" aesthetic with hand-drawn elements
- 🚀 **Fast & Modern** - Built with Next.js 15 and NestJS
- 📱 **Mobile-First** - Fully responsive design
- 🔒 **Secure** - JWT authentication with bcrypt password hashing
- 🎯 **Feature-Rich** - Everything a college student needs in one place

---

## ✨ Features

### **Core Modules** ✅ (Live)

#### 🔐 **Authentication & Profiles**
- Secure registration and login
- Customizable user profiles
- Bio, interests, social links (GitHub, Instagram)
- College affiliation
- Edit profile functionality

#### 🏛️ **Clubs**
- Browse all campus clubs
- View club details and member count
- Join/Leave clubs instantly
- Search clubs by name or description

#### 📅 **Events**
- Discover upcoming campus events
- RSVP with status (Going/Interested/Not Going)
- **Create your own events**
- Filter by date and venue
- View event details (date, time, location, organizer)

#### 🛍️ **Marketplace**
- Buy and sell items within your college
- **Post new listings**
- Browse with search functionality
- Contact sellers
- Item status tracking (Active/Sold)

#### 📚 **Study Materials (Notes)**
- Upload and share study materials
- **Like/Unlike system** for popular content
- Download/view files
- Browse by subject and semester
- Search functionality

#### 💬 **Community Feed**
- **Create text posts** to share updates
- Like posts
- View community activity
- Author information with timestamps

#### 🎨 **UI/UX Excellence**
- **Error Boundaries** - Graceful error handling on all pages
- **Loading States** - Smooth loading experience

### **Frontend** (`apps/web`)
```
Framework:    Next.js 15 (App Router)
Language:     TypeScript
Styling:      Tailwind CSS
Animations:   Framer Motion
State:        React Context API
HTTP Client:  Fetch API
```

### **Backend** (`apps/server`)
```
Framework:    NestJS 11
Language:     TypeScript
Database:     PostgreSQL (Supabase)
ORM:          Prisma 6.18.0
Auth:         JWT (@nestjs/jwt)
Validation:   class-validator
Security:     Helmet, CORS, bcrypt
```

### **Infrastructure**
```
Monorepo:     Turborepo
Deployment:   Vercel (Frontend) + Render (Backend)
Database:     Supabase (Managed PostgreSQL)
Version:      Git + GitHub
```

### **Database Models**
```
User, Profile, College, Club, ClubMember
Event, EventParticipant, MarketplaceListing
Note, NoteLike, Post, PostLike, Comment
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- PostgreSQL database (or Supabase account)

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone https://github.com/NAVANEETHVVINOD/UNOFFICAL.git
   cd UNOFFICAL
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**

   **Frontend** (`apps/web/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

   **Backend** (`apps/server/.env`):
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database"
   JWT_ACCESS_SECRET="your-secret-key-here"
   JWT_REFRESH_SECRET="your-refresh-secret-here"
   JWT_ACCESS_EXPIRES="15m"
   JWT_REFRESH_EXPIRES="7d"
   PORT=4000
   CORS_ORIGIN="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   cd apps/server
   npx prisma generate
   npx prisma migrate deploy
   # Or for development:
   npx prisma db push
   ```

5. **Start development servers**
   ```bash
   # From root directory:
   npm run dev

   # Or individually:
   # Terminal 1 - Backend
   cd apps/server && npm run start:dev

   # Terminal 2 - Frontend
   cd apps/web && npm run dev
   ```

6. **Access the app**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000
   - Prisma Studio: `npx prisma studio` (Database GUI)

---

## 💻 Development

### **Available Scripts**

**Root:**
```bash
npm run dev          # Start all apps
npm run build        # Build all apps
npm run lint         # Lint all apps
```

**Frontend (`apps/web`):**
```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

**Backend (`apps/server`):**
```bash
npm run start:dev    # NestJS dev mode with hot reload
npm run build        # Build for production
npm run start:prod   # Production server
npm run test         # Run tests
```

**Database:**
```bash
npx prisma generate            # Generate Prisma Client
npx prisma migrate dev         # Create & apply migration
npx prisma migrate deploy      # Deploy migrations (production)
npx prisma studio              # Open database GUI
npx prisma db push             # Push schema changes (dev only)
```

---

## 🌐 Deployment

### **Production URLs**
- **Frontend**: https://linker-inky.vercel.app
- **Backend**: https://linker-backend-wx4i.onrender.com

### **Deploy to Vercel (Frontend)**

1. Push code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Configure:
   - Framework: **Next.js**
   - Root Directory: **apps/web**
   - Build Command: `npm run build`
   - Install Command: `npm install --legacy-peer-deps`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
5. Deploy!

### **Deploy to Render (Backend)**

1. Create new Web Service in [Render](https://render.com)
2. Configure:
   - **Build Command**: 
     ```bash
     cd apps/server && npm install --legacy-peer-deps && npx prisma generate && npm run build
     ```
   - **Start Command**: 
     ```bash
     cd apps/server && npx prisma migrate deploy && npm run start:prod
     ```
3. Add environment variables (see `.env` example above)
4. Deploy!

---

## 📁 Project Structure

```
UNOFFICAL/
├── apps/
│   ├── web/                      # Next.js Frontend
│   │   ├── app/
│   │   │   ├── (auth)/          # Login, Register
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── profile/         # User profile & edit
│   │   │   ├── clubs/           # Clubs directory & details
│   │   │   ├── events/          # Events directory, details & create
│   │   │   ├── marketplace/     # Marketplace listings & create
│   │   │   ├── notes/           # Notes directory, details & upload
│   │   │   ├── feed/            # Community feed & create post
│   │   │   ├── components/      # UI components
│   │   │   ├── context/         # AuthContext
│   │   │   └── lib/             # API client
│   │   └── public/              # Static assets
│   │
│   └── server/                   # NestJS Backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/        # Authentication
│       │   │   ├── users/       # User management
│       │   │   ├── profiles/    # Profile management
│       │   │   ├── colleges/    # College data
│       │   │   ├── clubs/       # Club CRUD
│       │   │   ├── events/      # Event CRUD
│       │   │   ├── marketplace/ # Marketplace CRUD
│       │   │   ├── notes/       # Notes CRUD
│       │   │   └── posts/       # Community feed
│       │   ├── prisma/          # Prisma service
│       │   └── main.ts          # Entry point
│       └── prisma/
│           └── schema.prisma    # Database schema
│
├── packages/
│   └── config/                   # Shared TypeScript config
│
└── turbo.json                    # Turborepo config
```

---

## 📚 API Documentation

### **Base URL**
- Local: `http://localhost:4000`
- Production: `https://linker-backend-wx4i.onrender.com`

### **Authentication**

**Register**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "collegeId": "optional-college-id"
}
```

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123"
}

Response:
{
  "accessToken": "jwt-token",
  "user": { ... }
}
```

### **Protected Endpoints** (Require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user |
| GET | `/profiles/:id` | Get profile by ID |
| PATCH | `/profiles/:id` | Update profile |
| GET | `/clubs` | List all clubs |
| GET | `/clubs/:id` | Get club details |
| POST | `/clubs/:id/join` | Join club |
| DELETE | `/clubs/:id/leave` | Leave club |
| GET | `/events` | List all events |
| POST | `/events` | Create event |
| POST | `/events/:id/rsvp` | RSVP to event |
| GET | `/marketplace` | List marketplace items |
| POST | `/marketplace` | Create listing |
| GET | `/notes` | List study notes |
| POST | `/notes` | Upload note |
| POST | `/notes/:id/like` | Like note |
| GET | `/posts` | List community posts |
| POST | `/posts` | Create post |
| POST | `/posts/:id/like` | Like post |

---

## 🗺️ Roadmap

### **Phase 1: MVP** ✅ (Complete - Nov 2024)
- [x] Authentication & User Management
- [x] Clubs, Events, Marketplace, Notes modules
- [x] Community Feed
- [x] Profile Management
- [x] Responsive UI with Error Handling

### **Phase 2: Production Launch** 🚀 (In Progress)
- [ ] Deploy to production
- [ ] Collect user feedback (50+ students)
- [ ] Bug fixes & iterations

### **Phase 3: AI Assistant** 🤖 (Dec 2024)
- [ ] Gemini API integration
- [ ] Personalized academic assistant
- [ ] Resume & LinkedIn generator
- [ ] RAG for college-specific data

### **Phase 4: Advanced Features** (Q1 2025)
- [ ] Real-time messaging
- [ ] Push notifications
- [ ] Admin dashboard
- [ ] Mobile app (React Native)
- [ ] Gamification & badges

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

**Development Guidelines:**
- Follow TypeScript best practices
- Maintain the "Newspaper" UI theme
- Write descriptive commit messages
- Test locally before submitting PR

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Navaneeth V** - Creator & Lead Developer  
- GitHub: [@NAVANEETHVVINOD](https://github.com/NAVANEETHVVINOD)
- Email: navaneethvvinod@gmail.com

---

## 🙏 Acknowledgments

- **NestJS** - Powerful backend framework
- **Next.js** - Amazing React framework
- **Vercel** - Seamless frontend hosting
- **Render** - Reliable backend hosting
- **Supabase** - Managed PostgreSQL
- **Prisma** - Excellent database ORM
- **Open Source Community** - For inspiration and tools

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/NAVANEETHVVINOD/UNOFFICAL/issues)
- **Email**: navaneethvvinod@gmail.com
- **Discussions**: [GitHub Discussions](https://github.com/NAVANEETHVVINOD/UNOFFICAL/discussions)

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

<div align="center">

**Built with ❤️ for students, by students**

[🌐 Visit Live Site](https://linker-inky.vercel.app) • [📖 Documentation](https://github.com/NAVANEETHVVINOD/UNOFFICAL/wiki) • [🐛 Report Bug](https://github.com/NAVANEETHVVINOD/UNOFFICAL/issues)

</div>