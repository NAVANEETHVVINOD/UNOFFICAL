# Deployment Configuration Guide

## 🚨 Critical Requirements (Read First)

### 1. Supabase Connection Pooling (Mandatory for Render)
Render cannot connect directly to the database port `5432` reliably. You **MUST** use the connection pooler.

- **Frontend/Direct Access**: Use Port **5432**
- **Backend (Render)**: Use Port **6543** (Connection Pooler) + `?pgbouncer=true`

### 2. Environment Variable Scoping
- **NEXT_PUBLIC_...**: Exposed to the browser.
- Others: Server-only (Private).

---

## 🔧 Phase 1: Vercel Configuration (Frontend)

Go to **Vercel Dashboard → Project → Settings → Environment Variables** and set:

| Variable | Value Example | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyz...supabase.co` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Your Supabase Anon Key (Public) |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com` | URL of your deployed backend |

> **Note**: After setting these, you must **Redeploy** for them to take effect.

---

## 🔧 Phase 2: Render Configuration (Backend)

Go to **Render Dashboard → LINKER Service → Environment** and set:

| Variable | Value Format / Example | Critical Notes |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgres://...:6543/postgres?sslmode=require&pgbouncer=true` | **MUST** use port `6543` & `pgbouncer=true` |
| `DIRECT_URL` | `postgres://...:5432/postgres?sslmode=require` | Use port `5432` for migrations |
| `SHADOW_DATABASE_URL` | `postgres://...:5432/postgres?sslmode=require` | Same as `DIRECT_URL` (needed for Prisma) |
| `SUPABASE_URL` | `https://xyz...supabase.co` | Same as frontend URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | **Secret** Service Role Key (NOT Anon Key) |
| `SUPABASE_JWT_SECRET` | `super-secret...` | From Supabase API Settings |
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` | Your Vercel URL (no trailing slash) |
| `PORT` | `4000` | Standard port |

### Render Build Command
Ensure your build command matches:
```bash
npm install && npx prisma generate && npx prisma db push --accept-data-loss && npm run build
```

---

## 🧪 Phase 3: Post-Deployment Verification Checklist

### Frontend (Vercel)
- [ ] **"Something exploded" error is gone**: Indicates Supabase vars are present.
- [ ] **College Hub loads**: Indicates `NEXT_PUBLIC_API_URL` is correct.

### Backend (Render)
- [ ] **Build Succeeded**: Indicates `npx prisma db push` worked (Database connection valid).
- [ ] **Logs show "Nest application successfully started"**: Server is running.
- [ ] **No P1001 Errors**: Connection pooler is working.

### Manual Test Flow
1. **Register** a new user.
2. **Login** (should redirect to Dashboard).
3. **Upload** a file in "Notes" (Testing Storage).
4. **Create** an Event (Testing Database writes).

---

## 🆘 Troubleshooting

**Error: P1001 Can't reach database server**
- **Fix**: Check `DATABASE_URL` in Render. It MUST use port `6543`.

**Error: Missing Supabase Environment Variables (Frontend)**
- **Fix**: Check Vercel Environment Variables. Ensure they start with `NEXT_PUBLIC_`.

**Error: CORS / Network Error**
- **Fix**: Check `CORS_ORIGIN` in Render (must match Vercel URL) and `NEXT_PUBLIC_API_URL` in Vercel (must match Render URL).
