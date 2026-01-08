# Deployment Guide for Archer & Ash

This guide will help you deploy the Archer & Ash e-commerce site to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A MongoDB Atlas account with a database cluster
3. Node.js and npm installed

## Environment Variables Required

You'll need to set these environment variables in your Vercel project settings:

### Required:
- `MONGODB_URI` - Your MongoDB connection string
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?appName=archerandash`
  
- `JWT_SECRET` - A secure random string for JWT token signing
  - Generate a strong secret: `openssl rand -base64 32`
  - Or use an online generator

### Optional:
- `PAYPAL_CLIENT_ID` - PayPal client ID for payment processing (if using PayPal)

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy to production:**
   ```bash
   vercel --prod
   ```

   Or deploy to preview first:
   ```bash
   vercel
   ```

3. **Set Environment Variables:**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add the required environment variables listed above
   - Redeploy after adding variables

### Option 2: Deploy via Vercel Dashboard

1. **Push code to Git:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project in Vercel:**
   - Go to https://vercel.com/new
   - Import your Git repository
   - Vercel will auto-detect Next.js

3. **Configure environment variables:**
   - In the project settings, add all required environment variables
   - Deploy

## Post-Deployment Setup

### 1. Create Admin User

After deployment, you'll need to create an admin user for the hub:

```bash
# SSH into your Vercel deployment or run locally with production MONGODB_URI
node scripts/seed-admin.js
```

Or create a user manually:
- Email: `admin@archerandash.com`
- Password: `password123` (change this after first login!)

### 2. Verify Deployment

1. Visit your deployed site
2. Test the shop functionality
3. Login to `/hub/login` with admin credentials
4. Verify all features work correctly

## Important Notes

- **MongoDB URI**: Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add Vercel's IPs
- **JWT Secret**: Never commit your JWT_SECRET to git. Always use environment variables
- **Database**: Ensure your MongoDB database is accessible and has proper indexes
- **PayPal**: Update PayPal client ID in `app/providers.tsx` if using production PayPal credentials

## Troubleshooting

### Build Errors
- Ensure all dependencies are in `package.json`
- Check that TypeScript compiles without errors: `npm run build`

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct in Vercel environment variables
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### Authentication Issues
- Verify `JWT_SECRET` is set in Vercel
- Check that cookies are being set properly
- Ensure `secure` flag in auth routes matches environment (production vs development)

## Support

For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

