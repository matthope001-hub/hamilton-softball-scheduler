@echo off
echo 🏀 March Madness Bracket Tracker - Auto Push to GitHub
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first:
    echo    Download from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Git found. Setting up repository...
echo.

REM Initialize repository if not already done
if not exist .git (
    echo 📦 Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo 📁 Adding all files to Git...
git add .
echo.

REM Check for changes
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo ℹ️  No changes to commit.
    echo.
    goto :check_remote
)

REM Commit changes
echo 💾 Committing changes...
git commit -m "Update March Madness Bracket Tracker %date% %time%"
echo.

:check_remote
REM Check if remote exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔗 No remote repository found.
    echo.
    echo Please create a GitHub repository first:
    echo 1. Go to https://github.com/new
    echo 2. Name it: march-madness-bracket-2026
    echo 3. Copy the repository URL
    echo 4. Run this script again
    echo.
    set /p repo_url="Enter your GitHub repository URL: "
    git remote add origin "%repo_url%"
    echo.
)

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main
echo.

if %errorlevel% equ 0 (
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 🌐 Your repository is now available at:
    echo    https://github.com/matthope001-hub/march-madness-bracket-2026
    echo.
    echo 📋 Next steps:
    echo    1. Open your repository on GitHub
    echo    2. Go to Settings → Pages
    echo    3. Enable GitHub Pages for deployment
    echo.
) else (
    echo ❌ Failed to push to GitHub.
    echo    Please check your repository URL and credentials.
    echo.
)

pause
