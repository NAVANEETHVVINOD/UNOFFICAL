# 🔧 Linker Backend API

NestJS backend API for the Linker college social network platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run start:dev
```

API runs on [http://localhost:4000](http://localhost:4000)

## 📋 Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_ACCESS_SECRET="your-super-secret-access-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
```

## 🛠️ Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **ORM**: Prisma 6.18.0
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT
- **Validation**: class-validator
- **Security**: Helmet, CORS, bcrypt

## 📁 Project Structure

```
src/
├── modules/          # Feature modules
│   ├── auth/         # Authentication & JWT
│   ├── users/        # User management
│   ├── profiles/     # User profiles
│   ├── colleges/     # Colleges
│   ├── clubs/        # Student clubs
│   ├── events/       # Campus events
│   ├── marketplace/  # Buy/sell marketplace
│   └── notes/        # Study materials
├── prisma/           # Prisma service
├── config/           # App configuration
└── main.ts           # Application entry point

prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Database seeding
```

## 📜 Available Scripts

```bash
npm run start:dev    # Start in watch mode (http://localhost:4000)
npm run build        # Build for production
npm run start:prod   # Start production server
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npx prisma studio    # Open Prisma Studio (DB GUI)
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema to database
```

## 🗄️ Database Schema

### Models
- **User** - User accounts with authentication
- **Profile** - User profile information
- **College** - College/university information
- **Club** - Student clubs and organizations
- **ClubMember** - Club membership (M:N relation)
- **Event** - Campus events
- **EventParticipant** - Event RSVPs (M:N relation)
- **MarketplaceListing** - Marketplace items for sale
- **Note** - Study materials and notes
- **NoteLike** - Note likes (M:N relation)

### Enums
- **Role**: STUDENT, CLUBADMIN, ADMIN, SUPERADMIN
- **EventRSVPStatus**: GOING, INTERESTED, NOT_GOING
- **ListingStatus**: ACTIVE, SOLD, DELETED

## 🔐 API Endpoints

### Authentication
```
POST   /auth/register    # Register new user
POST   /auth/login       # Login user
POST   /auth/refresh     # Refresh access token
```

### Users & Profiles
```
GET    /users/me         # Get current user
GET    /profiles/me      # Get current profile
PATCH  /profiles/me      # Update profile
```

### Colleges & Clubs
```
GET    /colleges         # List all colleges
GET    /colleges/:slug   # Get college by slug
GET    /clubs            # List all clubs
GET    /clubs/:id        # Get club by ID
POST   /clubs/:id/join   # Join a club
DELETE /clubs/:id/leave  # Leave a club
```

### Events
```
GET    /events           # List all events
GET    /events/:id       # Get event by ID
POST   /events           # Create event (auth required)
POST   /events/:id/rsvp  # RSVP to event
```

### Marketplace
```
GET    /marketplace      # List all listings
GET    /marketplace/:id  # Get listing by ID
POST   /marketplace      # Create listing (auth required)
PATCH  /marketplace/:id  # Update listing (owner only)
```

### Notes
```
GET    /notes            # List all notes
GET    /notes/:id        # Get note by ID
POST   /notes            # Upload note (auth required)
POST   /notes/:id/like   # Like note
DELETE /notes/:id/like   # Unlike note
```

## 🔒 Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Expiry
- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

## 🌐 Deployment (Render)

1. Push code to GitHub
2. Create Web Service in Render
3. Configure:
   - **Build Command**: 
     ```bash
     cd apps/server && npm install --legacy-peer-deps && npx prisma generate && npm run build
     ```
   - **Start Command**: 
     ```bash
     cd apps/server && npm run start:prod
     ```
   - **Environment Variables**: Add all `.env` variables
4. Deploy

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Development Guidelines

### Adding a New Module

1. Generate module: `nest g module modules/feature-name`
2. Generate service: `nest g service modules/feature-name`
3. Generate controller: `nest g controller modules/feature-name`
4. Update Prisma schema if needed
5. Run `npx prisma generate`

### Adding a New Endpoint

1. Add DTO in `dto/` folder
2. Add validation decorators
3. Create method in service
4. Create route in controller
5. Add guards if authentication required

### Database Changes

1. Update `prisma/schema.prisma`
2. Run `npx prisma generate`
3. Run `npx prisma db push` (dev) or `npx prisma migrate dev` (prod)

## 📊 Prisma Studio

Visual database editor:

```bash
npx prisma studio
```

Opens at [http://localhost:5555](http://localhost:5555)

## 🤝 Contributing

See main [README.md](../../README.md) for contribution guidelines.
