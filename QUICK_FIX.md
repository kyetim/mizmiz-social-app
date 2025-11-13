# ⚡ Quick Fix - Database Connection Error

## 🎯 The Problem

Your login is failing because **your Supabase database is unreachable**.

Error in logs:
```
Can't reach database server at aws-1-eu-west-1.pooler.supabase.com:6543
```

---

## 🚀 Fast Solution (2 minutes)

### Step 1: Wake Up Supabase Database

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. If database shows **"Paused"**, click **"Resume"**
4. Wait 1-2 minutes

### Step 2: Test Backend

```bash
# Open PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/health"
```

Should return:
```json
{
  "success": true,
  "message": "MIZMIZ Backend is running!"
}
```

### Step 3: Try Login Again

Open `http://localhost:3000/login` and try logging in.

---

## ✅ What I Fixed

I improved your error handling so you get **better error messages** instead of generic ones:

### Before:
```
❌ "Bir hata oluştu. Lütfen tekrar deneyin."
   (Generic message, no clue what's wrong)
```

### After:
```
✅ "Veritabanı bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin."
   (Specific: database connection issue)
   
📊 Plus detailed console logs showing:
   - Request URL
   - HTTP status code
   - Error response data
   - Database server info
```

---

## 📱 Alternative: Use Local Database

If you don't want to deal with Supabase pausing:

```bash
# 1. Run PostgreSQL with Docker (easiest)
docker run --name mizmiz-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

# 2. Update backend/.env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mizmiz_db"

# 3. Run migrations
cd backend
npm run prisma:migrate
npm run prisma:seed

# 4. Restart backend
npm run dev
```

---

## 🔍 Check Status

```bash
# Backend health
curl http://localhost:5000/health

# Backend logs
Get-Content backend/logs/error.log -Tail 20

# Database connection
cd backend
npx prisma db pull
```

---

## 📞 Need More Help?

See detailed guide: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

