# Student Companion - Deployment Guide

## Architecture

| Component | Platform | URL |
|-----------|----------|-----|
| **Database** | Neon (PostgreSQL) | [neon.tech](https://neon.tech) |
| **Backend** | Render (Free tier) | `https://student-companion-api.onrender.com` |
| **Frontend** | Vercel (Free tier) | `https://student-companion.vercel.app` |

---

## Step 1: Database - Neon (Free PostgreSQL)

### Why PostgreSQL?
The project originally used MSSQL, but no free MSSQL cloud hosting exists. Since the app uses **Sequelize ORM**, switching to PostgreSQL required minimal code changes.

### Code Changes Made
1. **`backend/config/db.js`** - Changed dialect from `mssql` to `postgres`, added `DATABASE_URL` support with SSL
2. **`backend/package.json`** - Replaced `tedious` (MSSQL driver) with `pg` and `pg-hstore` (PostgreSQL drivers)
3. **`backend/.env`** - Updated with `DATABASE_URL` from Neon

### Neon Setup
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project:
   - **Project name**: `student_companion`
   - **Postgres version**: `17`
   - **Cloud provider**: `AWS`
   - **Region**: `US East 1 (N. Virginia)`
   - **Neon Auth**: Disabled (app has its own JWT auth)
3. Copy the connection string (`DATABASE_URL`):
   ```
   postgresql://<user>:<password>@<host>/neondb?sslmode=require
   ```

### Tables Created
All 12 tables are auto-created by Sequelize `sync()`:
- `students`, `faculty`, `materials`, `material_units`, `todos`
- `drives`, `drive_eligible_departments`, `drive_applications`
- `assignments`, `assignment_students`, `submissions`

---

## Step 2: Backend - Render (Free)

### Setup
1. Sign up at [render.com](https://render.com) with GitHub
2. Click **New +** > **Web Service**
3. Connect the GitHub repo: `narendra29-05/student_companion`
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `student-companion-api` |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Instance Type** | `Free` |

> Render auto-detects the `Dockerfile` in the backend folder and builds using Docker.

### Environment Variables (set in Render dashboard)

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://<user>:<password>@<host>/neondb?sslmode=require&channel_binding=require` |
| `JWT_SECRET` | Your JWT secret key |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Your Vercel frontend URL |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Your Gmail app password |

### Health Check
```
GET https://student-companion-api.onrender.com/api/health
```

> **Note**: Free tier instances spin down after 15 min of inactivity. First request after idle takes ~30-50 seconds.

---

## Step 3: Frontend - Vercel (Free)

### Setup
1. Sign up at [vercel.com](https://vercel.com) with GitHub
2. Click **Add New Project** > Import `student_companion`
3. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | `Create React App` |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |

### Environment Variables (set in Vercel dashboard)

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://student-companion-api.onrender.com/api` |

### Deploy
Click **Deploy** and Vercel will build and host the frontend.

---

## Step 4: Connect Frontend & Backend

After both are deployed:
1. Copy your Vercel frontend URL (e.g. `https://student-companion.vercel.app`)
2. Go to **Render** > Your service > **Environment** > Update `FRONTEND_URL` to the Vercel URL
3. Render will auto-redeploy with the updated CORS setting

---

## Local Development

To run locally after the database switch:

```bash
# Backend
cd backend
npm install
# Set DATABASE_URL in .env (or use local PostgreSQL)
npm run dev

# Frontend
cd frontend
npm install
npm start
```

---

## Summary of Code Changes for Deployment

| File | Change |
|------|--------|
| `backend/config/db.js` | MSSQL → PostgreSQL dialect, added `DATABASE_URL` support with SSL |
| `backend/package.json` | Replaced `tedious` with `pg` + `pg-hstore` |
| `backend/.env` | Updated with Neon `DATABASE_URL` |
