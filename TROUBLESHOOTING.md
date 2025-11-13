# 🔍 Troubleshooting Guide - Login Error

## Problem Summary

You encountered the error: **"Bir hata oluştu. Lütfen tekrar deneyin."** (An error occurred. Please try again.)

### Root Cause

**Database Connection Failure**: The backend cannot connect to your Supabase PostgreSQL database at `aws-1-eu-west-1.pooler.supabase.com:6543`.

The error logs show:
```
Can't reach database server at `aws-1-eu-west-1.pooler.supabase.com:6543`
```

---

## ✅ Solutions

### Solution 1: Wake Up Your Supabase Database (Recommended)

Supabase **free tier** databases pause after **1 week of inactivity**.

**Steps:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Check the database status:
   - If it shows **"Paused"** or **"Inactive"**, click **"Resume"** or **"Restore"**
   - Wait 1-2 minutes for the database to become active
4. Try logging in again

### Solution 2: Check Database Connection Settings

Verify your database connection string in `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?pgbouncer=true"
```

**Common Issues:**
- Expired password
- Changed database URL
- Firewall blocking the connection
- Network issues

### Solution 3: Use a Local PostgreSQL Database (For Development)

If you want to avoid the Supabase pause issue during development:

#### Step 1: Install PostgreSQL Locally

**Windows:**
- Download from [PostgreSQL Official Site](https://www.postgresql.org/download/windows/)
- Or use Docker: `docker run --name mizmiz-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

#### Step 2: Create Database

```sql
CREATE DATABASE mizmiz_db;
```

#### Step 3: Update `.env`

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mizmiz_db"
```

#### Step 4: Run Migrations

```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
```

#### Step 5: Restart Backend

```bash
npm run dev
```

---

## 🛠️ Improvements Made

I've improved the error handling to provide better diagnostics:

### Backend Changes

1. **Enhanced Prisma Error Handling** (`backend/src/middleware/error.middleware.ts`)
   - Now catches `PrismaClientInitializationError` specifically
   - Returns error code `SRV_003` (DATABASE_CONNECTION_ERROR)
   - Shows helpful message in development mode

2. **New Error Class** (`backend/src/utils/errors.ts`)
   - Added `DatabaseConnectionError` class
   - Returns HTTP 503 (Service Unavailable) instead of generic 500

### Frontend Changes

1. **Better Error Messages** (`frontend/src/lib/utils/error-handler.ts`)
   - Added `DATABASE_CONNECTION_ERROR` code
   - Turkish message: "Veritabanı bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin."

2. **Enhanced API Error Logging** (`frontend/src/lib/api/client.ts`)
   - Added detailed console logging in development mode
   - Shows URL, method, status, response data, and error codes

---

## 🧪 Testing Your Fix

After fixing the database connection:

1. **Check Backend Health:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Check Database Connection:**
   ```bash
   cd backend
   npx prisma db pull
   ```

3. **Try Login Again:**
   - Open your frontend: `http://localhost:3000/login`
   - Check the browser console for detailed error logs
   - You should now see more specific error messages

---

## 📊 Monitoring

### Check Backend Logs

```bash
# Error logs
cat backend/logs/error.log

# Combined logs
cat backend/logs/combined.log
```

### Frontend Console

Open browser DevTools (F12) and look for:
- `🔴 API Error Details` - Shows detailed request/response info
- `🔴 Error - API Error` - Shows the error handler output

---

## 🔄 Restart Backend Server

If you've made environment changes:

```bash
cd backend
npm run dev
```

The server should show:
```
🚀 Server is running on http://localhost:5000
🌍 Environment: development
📚 Health check: http://localhost:5000/health
```

---

## 📝 Quick Checklist

- [ ] Supabase database is active (not paused)
- [ ] `backend/.env` file exists with correct `DATABASE_URL`
- [ ] Backend server is running (`npm run dev`)
- [ ] Database migrations are up to date (`npm run prisma:migrate`)
- [ ] Frontend can reach backend (`http://localhost:5000/health`)
- [ ] Browser console shows detailed error logs

---

## 🆘 Still Having Issues?

### Check These:

1. **Backend running?**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Database accessible?**
   ```bash
   cd backend
   npx prisma studio
   ```

3. **CORS issues?**
   - Check `backend/src/server.ts` CORS configuration
   - Ensure frontend URL is in allowed origins

4. **Port conflicts?**
   - Backend should be on port 5000
   - Frontend should be on port 3000
   - Check if ports are already in use

---

## 🎯 Next Steps

1. **Resume your Supabase database** (most likely solution)
2. **Check the browser console** - you'll now see detailed error information
3. **Check backend logs** - `backend/logs/error.log`
4. **Try the login again** - you should get a more specific error message

The improved error handling will now show you exactly what's wrong instead of a generic message!

