#!/bin/bash

echo "🏀 March Madness Bracket Tracker - Auto Push to GitHub"
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   Mac: brew install git"
    echo "   Linux: sudo apt-get install git"
    echo "   Download: https://git-scm.com/downloads"
    echo ""
    exit 1
fi

echo "✅ Git found. Setting up repository..."
echo ""

# Initialize repository if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo ""
fi

# Add all files
echo "📁 Adding all files to Git..."
git add .
echo ""

# Check for changes
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit."
    echo ""
else
    # Commit changes
    echo "💾 Committing changes..."
    git commit -m "Update March Madness Bracket Tracker $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
fi

# Check if remote exists
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 No remote repository found."
    echo ""
    echo "Please create a GitHub repository first:"
    echo "1. Go to https://github.com/new"
    echo "2. Name it: march-madness-bracket-2026"
    echo "3. Copy the repository URL"
    echo "4. Run this script again"
    echo ""
    read -p "Enter your GitHub repository URL: " repo_url
    git remote add origin "$repo_url"
    echo ""
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
if git push -u origin main; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🌐 Your repository is now available at:"
    echo "   https://github.com/matthope001-hub/march-madness-bracket-2026"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Open your repository on GitHub"
    echo "   2. Go to Settings → Pages"
    echo "   3. Enable GitHub Pages for deployment"
    echo ""
else
    echo ""
    echo "❌ Failed to push to GitHub."
    echo "   Please check your repository URL and credentials."
    echo ""
fi

echo "Press Enter to continue..."
read
