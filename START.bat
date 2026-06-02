@echo off
echo ==========================================
echo   BID CHECK PRO - Setup and Launch
echo ==========================================
echo.
echo Step 1: Moving to project folder...
cd /d "C:\Users\freds\Downloads\bid-check-pro-fixed\bid-check-pro"

echo.
echo Step 2: Installing packages (takes ~30 sec)...
call npm install

echo.
echo Step 3: Starting the site...
echo.
echo ==========================================
echo   Site is running at http://localhost:3000
echo   Press Ctrl+C to stop
echo ==========================================
echo.
call npm run dev
pause
