# 🌐 Linker Frontend

Next.js 16 frontend application for the Linker college social network platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📋 Environment Variables

Create a `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion (coming soon)

## 📁 Project Structure

```
app/
├── (auth)/          # Authentication pages
│   ├── login/
│   └── register/
├── clubs/           # Clubs page
├── events/          # Events page
├── marketplace/     # Marketplace page
├── notes/           # Notes page
├── profile/         # Profile page
├── dashboard/       # Dashboard page
├── components/      # Reusable components
│   ├── common/      # Header, Footer, Nav
│   ├── sections/    # Landing sections
│   └── animations/  # Animated components
├── context/         # React Context
│   └── AuthContext.tsx
└── layout.tsx       # Root layout
```

## 📜 Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🎨 Pages

- **Landing Page** (/) - Hero, features, CTA
- **Login** (/login) - User authentication
- **Register** (/register) - New user signup
- **Dashboard** (/dashboard) - User dashboard  
- **Clubs** (/clubs) - Browse and join clubs
- **Events** (/events) - Browse events and RSVP
- **Marketplace** (/marketplace) - Buy/sell items
- **Notes** (/notes) - Browse and upload notes
- **Profile** (/profile) - User profile management

## 🔧 Development Guidelines

### Adding a New Page

1. Create a new folder in `app/`
2. Add `page.tsx` file
3. Update navigation in `components/common/Nav.tsx`

### Adding a Component  

1. Create component in `components/` (category folder)
2. Export from `index.ts` if needed
3. Import and use in pages

### Styling Guidelines

- Use Tailwind utility classes
- Keep dark mode support (`dark:` prefix)
- Mobile-first responsive design
- Use custom colors from `tailwind.config.js`

## 🌐 Deployment (Vercel)

1. Push code to GitHub
2. Import repository in Vercel
3. Configure:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --legacy-peer-deps`
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy

## 📞 API Integration

All API calls use `NEXT_PUBLIC_API_URL` from environment variables.

Example:
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

## 🤝 Contributing

See main [README.md](../../README.md) for contribution guidelines.
