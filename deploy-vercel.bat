@echo off
echo ====================================
echo Deploying Archer & Ash to Vercel
echo ====================================
echo.
echo Step 1: Login to Vercel (will open browser)
vercel login
echo.
echo Step 2: Deploying to production...
vercel --prod
echo.
echo Deployment complete!
echo.
echo IMPORTANT: Don't forget to set environment variables in Vercel dashboard:
echo - MONGODB_URI
echo - JWT_SECRET
echo.
pause



