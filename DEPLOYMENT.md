# Deployment Guide

## Local Development (Already Working! ✅)

Your application is configured correctly:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

Both are already configured to work together.

---

## Deploying to Production

### Frontend → Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to: `apps/web`
   - Framework Preset: **Next.js**

3. **Environment Variables**
   Add these in Vercel Dashboard → Project → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main branch

---

### Backend → Render

1. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configuration**
   - **Root Directory**: `apps/server`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Environment**: Node

3. **Environment Variables**
   In Render Dashboard → Environment, add:
   ```
   DATABASE_URL=your_supabase_postgres_url
   JWT_ACCESS_SECRET=super-secret-access-key
   JWT_REFRESH_SECRET=super-secret-refresh-key
   JWT_ACCESS_EXPIRES=15m
   JWT_REFRESH_EXPIRES=7d
   PORT=4000
   CORS_ORIGIN=https://your-vercel-frontend-url.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically

---

## Post-Deployment Checklist

- [ ] Update `CORS_ORIGIN` in Render with your Vercel URL
- [ ] Update `NEXT_PUBLIC_API_URL` in Vercel with your Render URL
- [ ] Test registration and login on production
- [ ] Verify database connection (check Render logs)
- [ ] Test College Hub navigation

---

## Troubleshooting

**CORS Errors:**
- Make sure `CORS_ORIGIN` in Render matches your Vercel URL exactly
- Include `https://` protocol

**Database Connection:**
- Verify `DATABASE_URL` is correctly set in Render
- Run `npx prisma generate` in build command

**Build Failures:**
- Check Render logs for specific errors
- Ensure all dependencies are in `package.json`
