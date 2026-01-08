# Quick Vercel Deployment Steps

Follow these steps to deploy your Archer & Ash site to Vercel:

## Step 1: Login to Vercel

```bash
vercel login
```

This will open a browser window for you to authenticate with Vercel.

## Step 2: Initialize Vercel Project (First Time)

```bash
vercel
```

Answer the prompts:
- **Set up and deploy?** Yes
- **Which scope?** (Select your account)
- **Link to existing project?** No (for first deployment)
- **What's your project's name?** archerandash (or your preferred name)
- **In which directory is your code located?** ./
- **Override settings?** No

## Step 3: Set Environment Variables

**IMPORTANT:** Before deploying to production, you must set these environment variables in Vercel:

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add the following:

### Required Variables:

```
MONGODB_URI=mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash
```

```
JWT_SECRET=<generate-a-strong-random-string>
```

**To generate a secure JWT_SECRET:**
- Windows (PowerShell): `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))`
- Or use an online generator: https://generate-secret.vercel.app/32

### Optional:

```
PAYPAL_CLIENT_ID=Aax7kTuGMzb7kK_X_D_zc3miLsr-_6O_2nvUfPgtH-rsAFrr8RIlRGpzaI0tMRAQ5NDul8ZJeQ2N4dBw
```

**Note:** Set these for all environments (Production, Preview, Development).

## Step 4: Deploy to Production

```bash
vercel --prod
```

## Step 5: Verify Deployment

1. Visit your deployed URL (shown after deployment)
2. Test the homepage
3. Navigate to `/hub/login`
4. Login with:
   - Email: `admin@archerandash.com`
   - Password: `password123`

## Troubleshooting

### If deployment fails:
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify MongoDB connection string is correct
- Check that JWT_SECRET is set

### If login doesn't work:
- Run the seed script to create admin user:
  ```bash
  # Set MONGODB_URI in your local environment
  node scripts/seed-admin.js
  ```

### Build Issues:
- Make sure `npm run build` works locally first
- Check for TypeScript errors
- Verify all dependencies are in package.json

## Next Steps After Deployment

1. **Change admin password** - Update the default password after first login
2. **Add products** - Start adding products via the hub dashboard
3. **Configure PayPal** - Update PayPal client ID if using production PayPal account
4. **Set up custom domain** - Add your custom domain in Vercel project settings

## Your Deployment URL

After deployment, Vercel will provide you with:
- Production URL: `https://your-project-name.vercel.app`
- Preview URLs for each branch/PR

---

**Need Help?**
- Check `DEPLOYMENT.md` for detailed information
- Visit https://vercel.com/docs for Vercel documentation

