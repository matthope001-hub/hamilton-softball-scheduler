@echo off
echo 🔧 Fix GitHub Push Issues
echo.

echo 📋 Step 1: Check current status
git status
echo.

echo 📋 Step 2: Check if remote exists
git remote -v
echo.

echo 📋 Step 3: Remove old remote (if exists)
git remote remove origin 2>nul
echo ✅ Old remote removed (if it existed)
echo.

echo 📋 Step 4: Add correct remote
git remote add origin https://github.com/matthope001-hub/march-madness-bracket-2026.git
echo ✅ Remote added
echo.

echo 📋 Step 5: Verify remote
git remote -v
echo.

echo 📋 Step 6: Configure credentials
git config --global user.name "matthope001-hub"
git config --global user.email "matt.hope001@gmail.com"
echo ✅ Credentials configured
echo.

echo 📋 Step 7: Check if we have commits
git log --oneline -1 2>nul
if %errorlevel% neq 0 (
    echo No commits found, creating initial commit...
    git add .
    git commit -m "Initial commit - March Madness Bracket Tracker 2026"
    echo ✅ Initial commit created
) else (
    echo ✅ Commits already exist
)
echo.

echo 📋 Step 8: Push to GitHub
git push -u origin main --force
echo.

echo 🎉 Push complete!
echo 🌐 https://github.com/matthope001-hub/march-madness-bracket-2026
pause
