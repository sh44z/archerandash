# Push to GitHub & Deploy to Vercel

Your code is committed and ready to push! Since the GitHub repo is already linked to Vercel, pushing will automatically trigger a deployment.

## Quick Steps to Push:

### Step 1: Push to GitHub

Run this command in your terminal (in the project directory):

```bash
git push -u origin main
```

### Step 2: Authenticate with GitHub

When prompted, you'll need to authenticate:

**Option A: Using GitHub Personal Access Token (Recommended)**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "Vercel Deployment"
4. Select scopes: `repo` (full control of private repositories)
5. Generate and copy the token
6. When Git prompts for password, paste the token (not your GitHub password)

**Option B: Using GitHub CLI**
If you have GitHub CLI installed:
```bash
gh auth login
git push -u origin main
```

### Step 3: Vercel Will Auto-Deploy

Since your GitHub repo is already linked to Vercel:
- Vercel will automatically detect the push
- It will start building your project
- Deployment will happen automatically

### Step 4: Set Environment Variables in Vercel

**IMPORTANT:** Before the site works, you must set environment variables in Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your `archerandash` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
MONGODB_URI=mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash
```

```
JWT_SECRET=<generate-a-strong-random-string>
```

**Generate JWT_SECRET:**
- Windows PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))`
- Or use: https://generate-secret.vercel.app/32

5. **Set for all environments** (Production, Preview, Development)
6. **Redeploy** after adding variables (or it will auto-redeploy on the next push)

### Step 5: Verify Deployment

After deployment:
1. Visit your Vercel URL (shown in Vercel dashboard)
2. Test the homepage
3. Try `/hub/login` with:
   - Email: `admin@archerandash.com`
   - Password: `password123`

## Troubleshooting

### If push fails:
- Make sure you're authenticated with GitHub
- Check that you have write access to the repo
- Try using GitHub Desktop app if command line fails

### If Vercel deployment fails:
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify MongoDB connection string is correct
- Make sure `JWT_SECRET` is set

### After first deployment:
Run the admin seed script to create the admin user:
```bash
node scripts/seed-admin.js
```
(You may need to run this locally with the production MONGODB_URI set, or create the admin user directly in MongoDB)

---

**Everything is ready! Just run `git push -u origin main` and follow the authentication steps above.**


