@echo off
echo 🧪 Test GitHub Connection
echo.

echo 📋 Step 1: Check Git Status
git status
echo.

echo 📋 Step 2: Check Remote Configuration
git remote -v
echo.

echo 📋 Step 3: Test GitHub Connection
git ls-remote origin
if %errorlevel% equ 0 (
    echo ✅ GitHub connection successful!
    echo.
    echo 📋 Step 4: Check if we can push
    echo Testing push capability...
    git push --dry-run origin main
    if %errorlevel% equ 0 (
        echo ✅ Push test successful!
        echo.
        echo 🎉 Everything is working!
        echo 🌐 Your repository: https://github.com/matthope001-hub/march-madness-bracket-2026
        echo.
        echo 📋 Ready to push for real? Run FIX-PUSH.bat
    ) else (
        echo ❌ Push test failed
        echo Need to run FIX-PUSH.bat
    )
) else (
    echo ❌ Cannot connect to GitHub
    echo Check:
    echo 1. Repository exists on GitHub
    echo 2. Internet connection is working
    echo 3. Repository URL is correct
    echo.
    echo 📋 Create repository at: https://github.com/new
)

echo.
pause
