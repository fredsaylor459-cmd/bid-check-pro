@echo off
echo ==========================================
echo   BID CHECK PRO - Deploy to Vercel
echo ==========================================
echo.
cd /d "C:\Users\freds\Downloads\bid-check-pro-fixed\bid-check-pro"

echo Initializing git...
git init

echo.
echo Setting up remote...
git remote remove origin 2>nul
git remote add origin https://github.com/fredsaylor459-cmd/bid-check-pro.git

echo.
echo Staging all files...
git add .

echo.
echo Committing new chrome/gloss build...
git commit -m "Full site rebuild - chrome gloss black design, Cash App, admin dashboard"

echo.
echo Pushing to GitHub (Vercel will auto-deploy)...
git branch -M main
git push -f origin main

echo.
echo ==========================================
echo   DONE! Vercel is now deploying.
echo   Check: https://vercel.com/dashboard
echo ==========================================
pause
