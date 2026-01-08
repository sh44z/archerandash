# Launch Site on Vercel

Your site is on GitHub! Here's how to deploy it on Vercel:

## Option 1: Auto-Deployment (If Repo Already Linked)

If your GitHub repo is already linked to Vercel:
1. **Check Vercel Dashboard**: Go to https://vercel.com/dashboard
2. **Find your project**: Look for `archerandash` project
3. **Check deployments**: You should see recent deployments from your GitHub push
4. **Set Environment Variables** (CRITICAL - see below)

## Option 2: Deploy via Vercel CLI

If you need to deploy manually or link a new project:

### Step 1: Login to Vercel
```bash
vercel login
```
This will open your browser for authentication.

### Step 2: Deploy
```bash
vercel --prod
```

Or deploy to preview first:
```bash
vercel
```

## ⚠️ CRITICAL: Set Environment Variables

**BEFORE your site works, you MUST set environment variables in Vercel:**

1. Go to: https://vercel.com/dashboard
2. Select your `archerandash` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

### Required Variables:

**MONGODB_URI:**
```
mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash
```

**JWT_SECRET:**
Generate a secure random string using:
- PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))`
- Or use: https://generate-secret.vercel.app/32

**IMPORTANT:**
- ✅ Set for **all environments** (Production, Preview, Development)
- ✅ After adding variables, **redeploy** your project
- ✅ Check that variables are correctly saved

## Step 3: Verify Deployment

After deployment completes:
1. Visit your Vercel URL (shown in dashboard)
2. Test the homepage
3. Navigate to `/hub/login`
4. Login with:
   - Email: `admin@archerandash.com`
   - Password: `password123`

## If Deployment Fails

Check build logs in Vercel dashboard:
- Go to your project → **Deployments** tab
- Click on the failed deployment
- Check the build logs for errors

Common issues:
- ❌ Missing environment variables → Set MONGODB_URI and JWT_SECRET
- ❌ Build errors → Check that `npm run build` works locally
- ❌ MongoDB connection → Verify MONGODB_URI is correct

## After First Deployment

Create the admin user by running:
```bash
node scripts/seed-admin.js
```

Or create manually in MongoDB with:
- Email: `admin@archerandash.com`
- Password: `password123` (change after first login!)

---

**Ready to deploy? Run `vercel login` then `vercel --prod`**



