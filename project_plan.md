# LINKER (Campus Community Platform) - Production Ready

**Version:** 2.0
**Project Type:** Full-Stack Web Application (Monorepo) + Mobile App
**Date:** 2025

## 1. Project Overview

**Project Name:** LINKER
**Tagline:** Connecting Students, Clubs & Campus Life

**Purpose:**
LINKER is a student-centric digital platform designed to unify all aspects of campus life — events, clubs, marketplace, notes, communities, and communication — into one interactive ecosystem.

## 2. Architecture & Tech Stack (Production Ready)

**Repository Structure:** Monorepo (Turborepo)

### 2.1 Frontend (`apps/web`)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Styled Components (for complex animations)
- **UI Library:** Shadcn/UI
- **State Management:** Zustand + React Query
- **Animations:** Framer Motion (Complex interactions, scroll animations)
- **Theme:** "Notebook" aesthetic, Doodles, Vibrant Gradients (Sunshine Yellow/Orange/Red), Sky Blue/White.

### 2.2 Backend API (`apps/server`)
- **Framework:** NestJS 11 (Modular, Scalable)
- **Language:** TypeScript
- **ORM:** Prisma
- **Authentication:** Passport.js + JWT (Role-based: Student, Admin, Club Lead)
- **Validation:** Class-validator + Zod

### 2.3 Database
- **Primary DB:** PostgreSQL (via Supabase)
- **Storage:** Supabase Storage (for Notes, Images)

### 2.4 Mobile (`apps/mobile`)
- **Framework:** React Native (Expo)
- **Styling:** NativeWind (Tailwind for RN)

## 3. Key Features (Production Scope)

### 3.1 Core Platform
- **Advanced Auth:** SSO (Google/Microsoft), Role-based Access Control (RBAC).
- **Real-time Engine:** Socket.io (for Chat, Live Event Updates).
- **Multi-Tenancy:** Database schema designed to support multiple colleges (Phase 3 ready).

### 3.2 Modules
- **Events:** Interactive calendar, registration, QR code check-in.
- **Clubs:** Management portal, member approval workflows, budget tracking.
- **Marketplace:** Escrow-like safety (verified users), chat-to-buy.
- **Academic:** Note sharing with OCR (future), resource library.
- **Gamification:** Leaderboards, activity points.

## 4. UI/UX Design Vision
- **Concept:** "Digital Notebook"
- **Visuals:**
    - Background: Graph paper / ruled paper textures.
    - Elements: Hand-drawn doodles, tape, staplers, sticky notes.
    - Colors:
        - Primary: Sunshine Yellow, Orange, Red (Gradients).
        - Secondary: Sky Blue, White.
    - Interactions: Cards moving left/right on scroll, "floating" elements.

## 5. Development Roadmap

### Phase 1: Foundation & Redesign (Current Focus)
- [x] Monorepo Setup
- [ ] **Landing Page Redesign:** Implement the "Notebook" aesthetic with high-end animations.
- [ ] **Auth System:** Connect NestJS to Supabase/Postgres.

### Phase 2: Core Modules
- [ ] Dashboard & Feed
- [ ] Events & Clubs
- [ ] Marketplace

### Phase 3: Mobile & Scale
- [ ] React Native App Parity
- [ ] Multi-college onboarding
