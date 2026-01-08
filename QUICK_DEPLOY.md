# Quick Vercel Deployment Guide

## ✅ Your Code is Ready!
- ✅ Code committed: Yes
- ✅ Pushed to GitHub: Yes (`remotes/origin/main`)
- ✅ Ready for Vercel: Yes

## 🚀 Deploy Now - Choose One Method:

### Method 1: Via Vercel Dashboard (Easiest)

1. **Go to**: https://vercel.com/dashboard
2. **Check for your project**: Look for `archerandash`
   - If it exists → Click it → Check "Deployments" tab
   - If deployment exists → It's already deploying!
   - If no deployment → Click "Redeploy" or wait for auto-deployment

3. **If project doesn't exist**:
   - Click "Add New" → "Project"
   - Import from GitHub → Select `sh44z/archerandash`
   - Click "Import"
   - **Set environment variables** (see below) before deploying

### Method 2: Via Command Line (Recommended)

**Run this in your terminal:**

```bash
vercel login
```

After login, deploy:
```bash
vercel --prod
```

Or use the batch file:
```bash
.\deploy-vercel.bat
```

## ⚠️ CRITICAL: Set Environment Variables

**BEFORE your site works, set these in Vercel Dashboard:**

1. Go to your project → **Settings** → **Environment Variables**
2. Add these variables:

```
MONGODB_URI=mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash
```

```
JWT_SECRET=<generate-a-random-string>
```

**To generate JWT_SECRET:**
- PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))`
- Or use: https://generate-secret.vercel.app/32

**IMPORTANT:**
- ✅ Set for **all environments** (Production, Preview, Development)
- ✅ After adding → **Redeploy** your project

## ✅ After Deployment

1. Visit your Vercel URL (shown in dashboard)
2. Test homepage
3. Go to `/hub/login`
4. Login with:
   - Email: `admin@archerandash.com`
   - Password: `password123`

## 🐛 Troubleshooting

**Deployment fails?**
- Check build logs in Vercel dashboard
- Ensure environment variables are set
- Verify `npm run build` works locally

**Site loads but login doesn't work?**
- Verify JWT_SECRET is set
- Check MongoDB URI is correct
- Create admin user: `node scripts/seed-admin.js`

---

**Quick Start: Run `vercel login` then `vercel --prod`**


