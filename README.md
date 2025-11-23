# 🎓 Linker - College Social Network Platform

> Connect. Learn. Live. - A comprehensive social platform for college students to manage campus life, clubs, events, marketplace, and academic resources.

[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

---

## 🌟 Overview

**Linker** is a full-stack social networking platform designed specifically for college students. It provides a centralized hub for managing campus activities, connecting with peers, buying/selling items, sharing study materials, and staying updated with college events.

### **Key Highlights**
- 🔐 **Secure Authentication** - JWT-based auth with refresh tokens
- 🏛️ **Multi-College Support** - Supports multiple colleges with college-specific content
- 🎯 **Club Management** - Create, join, and manage student clubs
- 📅 **Event System** - RSVP to campus events with status tracking
- 🛍️ **Marketplace** - Buy and sell items within your college community
- 📚 **Note Sharing** - Upload and access study materials with like system
- 🎨 **Modern UI** - Beautiful, responsive design with Next.js 15 and Tailwind CSS

---

## ✨ Features

### **Implemented** ✅

#### 🔐 Authentication & User Management
- User registration with email/password
- Secure login with JWT access & refresh tokens
- Profile management with bio, interests, and college affiliation
- Role-based access control (Student, Admin, Superadmin)

#### 🏛️ Colleges & Clubs
- Browse colleges by city
- Create and join student clubs
- Club member management
- College-specific content filtering

#### 📅 Events
- Browse upcoming campus events
- RSVP with status (Going/Interested/Not Going)
- Event creation by authorized users
- Filter events by college

#### 🛍️ Marketplace
- Post items for sale
- Browse listings by college
- Search functionality
- Item status tracking (Active/Sold/Deleted)

#### 📚 Notes & Resources
- Upload study materials and notes
- Like/unlike system for popular content
- Search notes by title/subject
- College-specific note filtering

### **Planned** 🚧
- Direct messaging between users
- Push notifications for events and marketplace
- Advanced search and filters
- User reputation system
- Mobile app (React Native)

---

## 🛠️ Tech Stack

### **Frontend** (apps/web)
- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: React Context API
- **Animations**: Framer Motion

### **Backend** (apps/server)
- **Framework**: NestJS 11
- **Language**: TypeScript
- **ORM**: Prisma 6.18.0
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (@nestjs/jwt)
- **Validation**: class-validator, class-transformer
- **Security**: Helmet, CORS, bcrypt

### **Database Schema**
```prisma
User → Profile (1:1)
User → Clubs (M:N via ClubMember)
User → Events (M:N via EventParticipant)
User → MarketplaceListing (1:N)
User → Note (1:N)
College → Clubs (1:N)
College → Events (1:N)
```

### **DevOps & Tools**
- **Monorepo**: Turborepo
- **Package Manager**: npm
- **Version Control**: Git & GitHub
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: Supabase (PostgreSQL)

---

## 📁 Project Structure

```
unoffical/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── app/               # App router pages
│   │   │   ├── (auth)/       # Auth pages (login, register)
│   │   │   ├── clubs/        # Clubs page
│   │   │   ├── events/       # Events page
│   │   │   ├── marketplace/  # Marketplace page
│   │   │   ├── notes/        # Notes page
│   │   │   ├── profile/      # Profile page
│   │   │   └── dashboard/    # Dashboard page
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/       # Common components (Footer, Nav)
│   │   │   ├── sections/     # Landing page sections
│   │   │   └── animations/   # Animation components
│   │   ├── context/          # React Context (AuthContext)
│   │   └── styles/           # Global styles
│   │
│   └── server/                # NestJS Backend
│       ├── src/
│       │   ├── modules/      # Feature modules
│       │   │   ├── auth/     # Authentication module
│       │   │   ├── users/    # Users module
│       │   │   ├── profiles/ # Profiles module
│       │   │   ├── colleges/ # Colleges module
│       │   │   ├── clubs/    # Clubs module
│       │   │   ├── events/   # Events module
│       │   │   ├── marketplace/ # Marketplace module
│       │   │   └── notes/    # Notes module
│       │   ├── prisma/       # Prisma service
│       │   ├── config/       # Configuration module
│       │   └── main.ts       # Entry point
│       ├── prisma/
│       │   ├── schema.prisma # Database schema
│       │   └── seed.ts       # Database seeding
│       └── dist/             # Compiled output
│
├── packages/
│   └── config/               # Shared TypeScript config
│
├── turbo.json               # Turborepo config
├── package.json             # Root package.json
└── README.md                # This file
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js ≥18.0.0
- npm ≥9.0.0
- PostgreSQL database (or Supabase account)

### **Installation**

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

   **Frontend** (`apps/web/.env`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

   **Backend** (`apps/server/.env`):
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database"
   JWT_ACCESS_SECRET="your-access-secret"
   JWT_REFRESH_SECRET="your-refresh-secret"
   JWT_ACCESS_EXPIRES="15m"
   JWT_REFRESH_EXPIRES="7d"
   PORT=4000
   CORS_ORIGIN="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   cd apps/server
   npx prisma generate
   npx prisma db push
   ```

5. **Start development servers**

   **Option 1: Run all (from root)**
   ```bash
   npm run dev
   ```

   **Option 2: Run individually**
   ```bash
   # Terminal 1 - Backend
   cd apps/server
   npm run start:dev

   # Terminal 2 - Frontend
   cd apps/web
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

---

## 💻 Development

### **Available Scripts**

**Root Level:**
```bash
npm run dev          # Start all apps in development
npm run build        # Build all apps
npm run lint         # Lint all apps
```

**Frontend (apps/web):**
```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

**Backend (apps/server):**
```bash
npm run start:dev    # Start NestJS in watch mode
npm run build        # Build for production
npm run start:prod   # Start production server
npm run test         # Run tests
npx prisma studio    # Open Prisma Studio (DB GUI)
```

### **Database Commands**
```bash
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema to database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create migration (production)
```

---

## 🌐 Deployment

### **Frontend (Vercel)**

1. Push code to GitHub
2. Import repository in Vercel
3. Configure build settings:
   - **Framework**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install --legacy-peer-deps`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
5. Deploy

### **Backend (Render)**

1. Push code to GitHub
2. Create new Web Service in Render
3. Configure:
   - **Build Command**: 
     ```bash
     cd apps/server && npm install --legacy-peer-deps && npx prisma generate && npm run build
     ```
   - **Start Command**: 
     ```bash
     cd apps/server && npm run start:prod
     ```
   - **Environment Variables**:
     - `DATABASE_URL`
     - `JWT_ACCESS_SECRET`
     - `JWT_REFRESH_SECRET`
     - `JWT_ACCESS_EXPIRES`: `15m`
     - `JWT_REFRESH_EXPIRES`: `7d`
     - `PORT`: `4000`
     - `CORS_ORIGIN`: Your Vercel frontend URL
4. Deploy

---

## 📚 API Documentation

### **Base URL**
- Development: `http://localhost:4000`
- Production: `https://your-backend.onrender.com`

### **Authentication Endpoints**

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "collegeId": "college-id-here"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123"
}

Response: {
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### **Protected Endpoints**
All protected endpoints require `Authorization: Bearer <token>` header.

- `GET /users/me` - Get current user
- `GET /profiles/me` - Get current user profile
- `PATCH /profiles/me` - Update profile
- `GET /clubs` - List all clubs
- `POST /clubs/:id/join` - Join a club
- `GET /events` - List all events
- `POST /events/:id/rsvp` - RSVP to event
- `GET /marketplace` - Browse marketplace
- `POST /marketplace` - Create listing
- `GET /notes` - Browse notes
- `POST /notes` - Upload note
- `POST /notes/:id/like` - Like a note

For complete API documentation, visit `/api-docs` (Swagger - coming soon).

---

## 🔄 Control Flow

### **User Authentication Flow**
```
1. User Registration
   ↓
2. Password Hashing (bcrypt)
   ↓
3. Create User + Profile (Prisma transaction)
   ↓
4. Generate JWT Tokens (Access + Refresh)
   ↓
5. Return tokens + sanitized user data

Login Flow:
1. Verify credentials
   ↓
2. Compare password hash
   ↓
3. Generate new tokens
   ↓
4. Return tokens + user data
```

### **Protected Resource Access**
```
1. Client sends request with Authorization header
   ↓
2. JwtAuthGuard validates token
   ↓
3. Attach user to request object
   ↓
4. (Optional) RolesGuard checks user role
   ↓
5. Execute controller method
   ↓
6. Return response
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Navaneeth V** - [@NAVANEETHVVINOD](https://github.com/NAVANEETHVVINOD)

---

## 🙏 Acknowledgments

- NestJS Team for the amazing backend framework
- Vercel for frontend hosting
- Render for backend hosting
- Supabase for managed PostgreSQL
- The open-source community

---

## 📞 Support

For support, email navaneethvvinod@gmail.com or open an issue on GitHub.

---

**Built with ❤️ for students, by students**