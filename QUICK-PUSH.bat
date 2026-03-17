@echo off
echo 🚀 Quick Auto-Push to GitHub
echo.

REM Configure Git credentials
git config --global user.name "matthope001-hub"
git config --global user.email "matt.hope001@gmail.com"

REM Quick Git commands - no prompts
git init 2>nul
git add .
git commit -m "Initial commit - March Madness Bracket Tracker 2026 - %date% %time%"
git branch -M main
git remote add origin https://github.com/matthope001-hub/march-madness-bracket-2026.git 2>nul
git push -u origin main --force

echo.
echo ✅ Pushed to GitHub!
echo 🌐 https://github.com/matthope001-hub/march-madness-bracket-2026
echo.
echo 📋 Next: Enable GitHub Pages in Settings
pause
