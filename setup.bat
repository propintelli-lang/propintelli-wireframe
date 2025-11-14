@echo off
echo ========================================
echo PropIntelli API Integration Setup
echo ========================================

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo Step 2: Creating environment file...
echo NEXT_PUBLIC_API_BASE_URL=http://propintelli-website.s3-website.eu-central-1.amazonaws.com > .env.local

echo Step 3: Verifying environment file...
type .env.local

echo Step 4: Starting development server...
echo.
echo ========================================
echo Setup complete! Opening browser...
echo ========================================
echo.
echo The app will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

start http://localhost:3000
call npm run dev



