<div align="center">

  <img src="apps/web/public/icons/icon.svg" alt="LINKER Logo" width="120" height="120" />

  # LINKER
  ### The Campus Collective Super-App

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg?style=flat&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg?style=flat&logo=supabase)](https://supabase.com/)

  <p align="center">
    <b>Connect. Collaborate. Campus.</b><br />
    A hyper-local, exclusive social network bridging the gap between students, events, and opportunities.
  </p>

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Design Philosophy](#-design-philosophy)
- [Technical Architecture](#-technical-architecture)
  - [Tech Stack](#tech-stack)
  - [System Diagrams](#system-diagrams)
- [API Documentation](#-api-documentation)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 About the Project

**LINKER** is not just another social media app. It is a gated, institution-specific platform designed to foster genuine connection within college campuses. By verifying students against their college database, LINKER ensures a safe, noise-free environment for:

1.  **Campus Life**: knowing what's happening *right now* (Events, Clubs).
2.  **Professional Growth**: finding gigs, freelance work, and building a portfolio.
3.  **Community**: connecting with peers in your batch, major, or district.

---

## ✨ Key Features

### 🏛️ Campus Dashboard
-   **Exclusive Access**: Secure onboarding requiring valid college credentials.
-   **Global Feed**: Real-time ticker, polls, and media updates from the campus community.
-   **Navigation**: Intuitive "Orbit" and "Swipe" navigation for mobile-first usability.

### 📅 Events Ecosystem
-   **Smart Ticketing**: QR Code generation for every RSVP.
-   **Admin Scanner**: Built-in PWA QR Scanner for event organizers.
-   **Discovery**: Advanced filtering (Trending, This Week, Past Events).

### 💼 Marketplace & Freelance
-   **Peer-to-Peer Commerce**: Buy/Sell textbooks, electronics, and dorm needs.
-   **Freelance Nexus**: Students can list services (Design, Tutor, Code) and get hired.
-   **Job Board**: Campus-specific internships and opportunities.

### 💬 Modern Messaging
-   **Split-View UI**: Discord-inspired layout with sidebar and chat pane.
-   **Community Groups**: Interest-based channels (Coding, Music, Sports).
-   **Real-Time**: Built on Socket.io for instant communication.

### 👤 Identity & Profile
-   **Inverted Layout**: Unique UI prioritizing "Life Blocks" (Projects, Activity) over static stats.
-   **Gamification**: "Link Score" and activity heatmaps (GitHub style).

---

## 🎨 Design Philosophy: "Nano Banana Pro"

We adopted a custom design language specifically for Gen-Z student developers:

| Element | Specification | Purpose |
| :--- | :--- | :--- |
| **Theme** | Neo-Brutalist | High contrast, bold borders (`2px`), hard shadows. |
| **Colors** | Ink Black (`#121212`) & Verified Yellow (`#F4B400`) | Professional yet energetic. High readability. |
| **Typography** | `Space Grotesk` (Headers) + `Inter` (Body) | Technical, futuristic, clean. |
| **Motion** | Tilted Cards & Snap Transitions | Adds a playful, "tactile" feel to the digital UI. |
| **Backgrounds** | Animated Grids & Dot Patterns | Engineering blueprint aesthetic. |

---

## 🏗️ Technical Architecture

### Tech Stack

-   **Frontend**: Next.js 16 (App Router), React 19 (RC), TailwindCSS, Framer Motion.
-   **Backend**: Node.js, Express, Socket.io (Real-time).
-   **Database**: PostgreSQL (via Supabase), Prisma ORM.
-   **State Management**: Zustand (Client), TanStack Query (Server State).
-   **Tools**: Turborepo (Monorepo), Vitest (Testing), Zod (Validation).

### System Diagrams

#### User Journey Flow

```mermaid
graph TD
    User((Student)) -->|Opens App| Auth{Authenticated?}
    Auth -- No --> Login[Login / Register]
    Auth -- Yes --> Dashboard[Global Dashboard]
    
    Dashboard -->|Swipe Left| Campus[College Campus]
    Dashboard -->|Nav Bar| Market[Marketplace]
    Dashboard -->|Nav Bar| Messages[Messages]
    Dashboard -->|Nav Bar| Profile[Profile]
    
    Campus --> Events[Events Feed]
    Campus --> Clubs[Clubs List]
    
    Events -->|RSVP| Ticket[QR Ticket]
    Ticket -->|Scan| Validator((Organizer))
```

#### Data Relationship Model (ERD)

```mermaid
erDiagram
    USER ||--o{ POST : creates
    USER ||--o{ EVENT : organizes
    USER ||--o{ LISTING : sells
    
    COLLEGE ||--o{ USER : contains
    COLLEGE ||--o{ EVENT : hosts
    
    EVENT ||--o{ RSVP : has
    
    CLUB ||--o{ USER : members
    CLUB ||--o{ EVENT : hosts
    
    CONVERSATION ||--o{ MESSAGE : contains
    CONVERSATION ||--o{ USER : participants
```

---

## 🔌 API Documentation

The backend exposes a RESTful API (documented via Postman). Key endpoints include:

### Authentication
-   `POST /auth/register` - Create new student account.
-   `POST /auth/login` - Authenticate and receive JWT.

### Events
-   `GET /events` - List all events (supports filters).
-   `POST /events` - Create a new event (Admin only).
-   `POST /events/:id/rsvp` - Register for an event.
-   `POST /events/:id/check-in` - Validate QR Code ticket.

### Marketplace
-   `GET /marketplace` - List products, services, and jobs.
-   `POST /marketplace` - Create a listing.

### Social
-   `POST /posts` - Create a social feed post.
-   `POST /messages` - Send a private message.

*(Full API documentation available in `/docs/api` or Swagger UI)*

---

## 🏁 Getting Started

### Prerequisites
-   Node.js v20+
-   npm or pnpm
-   PostgreSQL Database URL (Supabase recommended)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/NAVANEETHVVINOD/UNOFFICAL.git
    cd UNOFFICAL
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Generate Prisma Client**
    ```bash
    npx prisma generate
    ```

### Environment Variables

Create a `.env` file in `apps/server` and `apps/web`:

**`apps/server/.env`**
```env
port=4000
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="your-super-secret-key"
CLIENT_URL="http://localhost:3000"
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### Running Locally

Start the development server (runs both Frontend and Backend via Turbo):

```bash
npm run dev
```
-   Frontend: `http://localhost:3000`
-   Backend: `http://localhost:4000`

---

## 📂 Project Structure

```bash
.
├── apps
│   ├── web/                 # Next.js Frontend
│   │   ├── app/             # App Router Pages
│   │   ├── components/      # Reusable UI Components
│   │   └── lib/             # Utilities & API Clients
│   └── server/              # Node.js Backend
│       ├── src/
│       │   ├── controllers/ # Route Logic
│       │   ├── services/    # Business Logic
│       │   └── routes/      # API Definitions
│       └── prisma/          # Database Schema
├── packages/                # Shared UI/Config (Monorepo)
└── README.md                # You are here
```

---

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">Made with 💛 by the LINKER Team</p>
