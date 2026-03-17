# 🚀 Auto Push to GitHub

I've created automatic scripts to push your March Madness Bracket Tracker to GitHub with one click!

## 📋 Files Created

### For Windows Users
- **`push-to-github.bat`** - Double-click to auto-push

### For Mac/Linux Users  
- **`push-to-github.sh`** - Run from terminal

## 🎯 How to Use

### Windows (Easiest)
1. **Double-click** `push-to-github.bat`
2. **Follow prompts** - script will:
   - Check if Git is installed
   - Initialize repository if needed
   - Add all files
   - Commit changes
   - Push to GitHub

### Mac/Linux
1. **Open terminal**
2. **Navigate to project folder**:
   ```bash
   cd windsurf-project-2
   ```
3. **Make script executable**:
   ```bash
   chmod +x push-to-github.sh
   ```
4. **Run script**:
   ```bash
   ./push-to-github.sh
   ```

## 🔧 First Time Setup

### 1. Install Git (if not installed)
- **Windows**: Download from [git-scm.com](https://git-scm.com/download/win)
- **Mac**: `brew install git`
- **Linux**: `sudo apt-get install git`

### 2. Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `march-madness-bracket-2026`
3. Set to Public or Private
4. Click "Create repository"
5. Copy the repository URL

### 3. Run Auto-Push Script
- The script will ask for your repository URL on first run
- Enter the URL you copied from GitHub
- Script will handle everything else automatically

## ✅ What the Script Does

1. **🔍 Checks Git Installation**
2. **📦 Initializes Repository** (if needed)
3. **📁 Adds All Files** to Git
4. **💾 Commits Changes** with timestamp
5. **🔗 Sets Up Remote** (if needed)
6. **🚀 Pushes to GitHub**

## 🔄 After Initial Setup

Once configured, just run the script again to:
- Commit any new changes
- Push updates to GitHub
- Deploy automatically (if you have GitHub Actions enabled)

## 🌐 Next Steps After Push

1. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Save

2. **Get Live URL**:
   - Your site will be available at:
   - `https://YOUR_USERNAME.github.io/march-madness-bracket-2026`

3. **Share with Others**:
   - Send the live URL to friends/family
   - They can create their brackets immediately!

## 🎯 Benefits

- **☁️ Cloud Backup**: Your code is safely stored on GitHub
- **🔄 Auto-Deployment**: With GitHub Actions, pushes deploy automatically
- **👥 Collaboration**: Others can contribute or view your code
- **📱 Accessibility**: Access your project from anywhere

## 🔧 Troubleshooting

### Git Not Found
- Install Git first (see above)
- Restart your computer after installation

### Permission Denied (Mac/Linux)
```bash
chmod +x push-to-github.sh
```

### Authentication Issues
- Set up GitHub Personal Access Token
- Use `git config --global user.name "Your Name"`
- Use `git config --global user.email "your.email@example.com"`

---

**🏀 Ready to share your March Madness Bracket Tracker with the world!**
