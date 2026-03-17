@echo off
echo 🔍 Debug GitHub Push Issues
echo.

echo 📋 Step 1: Check Git Installation
git --version
if %errorlevel% neq 0 (
    echo ❌ Git not installed - download from git-scm.com
    pause
    exit /b 1
)
echo ✅ Git is installed
echo.

echo 📋 Step 2: Check Repository Status
git status
echo.

echo 📋 Step 3: Check Remote Configuration
git remote -v
echo.

echo 📋 Step 4: Configure Git Credentials
git config --global user.name "matthope001-hub"
git config --global user.email "matt.hope001@gmail.com"
echo ✅ Git configured with correct credentials
echo.

echo 📋 Step 5: Verify Configuration
git config --global user.name
git config --global user.email
echo.

echo 📋 Step 6: Try Manual Push Step-by-Step
echo Initializing repository...
git init

echo Adding files...
git add .

echo Checking if there are files to commit...
git status
echo.

echo Committing changes...
git commit -m "Initial commit - March Madness Bracket Tracker 2026 - %date% %time%"

echo Verifying commit exists...
git log --oneline -1
echo.

echo Setting up remote...
git remote add origin https://github.com/matthope001-hub/march-madness-bracket-2026.git

echo Setting main branch...
git branch -M main

echo Attempting push...
git push -u origin main

echo.
echo 📊 Debug complete!
echo If push failed, check:
echo 1. Repository exists on GitHub
echo 2. You have internet connection
echo 3. GitHub credentials are configured
echo.
pause
