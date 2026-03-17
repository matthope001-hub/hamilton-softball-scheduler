# 🏀 March Madness Bracket Tracker 2026

A comprehensive March Madness bracket tracking application with multi-user support, Google Sheets integration, and automatic deployment capabilities.

## ✨ Features

### 🎯 Core Features
- **Interactive Bracket**: Click teams to make predictions through all 6 rounds
- **Multi-User Support**: Multiple participants with individual brackets
- **Real-Time Scoring**: Standard March Madness scoring (1-2-4-8-16-32 points)
- **Live Leaderboard**: Sortable rankings with gold/silver/bronze highlighting
- **Tournament Results**: Automatic or manual result entry

### ☁️ Cloud Integration
- **Google Sheets Sync**: Store brackets and results in Google Sheets
- **Real-Time Collaboration**: Multiple users can participate simultaneously
- **Automatic Backups**: Data preserved across devices and browsers
- **Export Options**: CSV, Excel, and PDF export capabilities

### 🚀 Deployment Options
- **GitHub Pages**: Free static hosting from your repository
- **Netlify**: Continuous deployment with form handling
- **Vercel**: Modern frontend deployment with global CDN
- **Docker**: Containerized deployment for any cloud platform
- **GitHub Actions**: Automated deployment on push

## 🚀 Quick Deploy

### Option 1: GitHub Pages (Easiest)
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select "Deploy from branch" → main
4. Your site is live at `https://username.github.io/repository-name`

### Option 2: Netlify
1. Create account at [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Deploy with default settings

### Option 3: Vercel
1. Create account at [vercel.com](https://vercel.com)
2. Click "New Project" → Import from Git
3. Configure as static site
4. Deploy instantly

## 📋 Setup Instructions

### Local Development
```bash
# Clone the repository
git clone [repository-url]
cd windsurf-project-2

# Start local server
python -m http.server 8000
# or
npx serve .
```

### Google Sheets Integration
1. Open `google-sheets-setup.html` for detailed instructions
2. Create Google Cloud Project and enable APIs
3. Get API key and Sheet ID
4. Click "Configure Google Sheets" in the app
5. Enter your credentials

### Environment Variables
For production deployments, set these environment variables:
- `GOOGLE_SHEETS_API_KEY`: Your Google Sheets API key
- `GOOGLE_SHEETS_ID`: Your Google Sheet ID

## 🏗️ Project Structure

```
windsurf-project-2/
├── index.html              # Main application
├── styles.css              # Styling
├── script-sheets.js        # JavaScript with Google Sheets integration
├── deploy.html             # Deployment guide
├── google-sheets-setup.html # Google Sheets setup instructions
├── netlify.toml           # Netlify configuration
├── vercel.json            # Vercel configuration
├── .github/workflows/      # GitHub Actions
│   └── deploy.yml         # Automated deployment
└── README.md              # This file
```

## 🎮 How to Use

### For Participants
1. **Enter Your Name**: Type your name and click "Start Bracket"
2. **Make Predictions**: Click teams to select winners for each matchup
3. **Save Progress**: Click "Save Bracket" to save your work
4. **Submit Final**: Complete entire bracket and click "Submit Final Bracket"
5. **Track Scores**: View leaderboard to see your ranking

### For Administrators
1. **Enter Results**: Use Admin Mode to enter actual tournament results
2. **Auto-Update**: Enable automatic result fetching
3. **Simulate Tournament**: Generate realistic results for testing
4. **Manage Users**: View all submitted brackets and scores

## 📊 Scoring System

| Round | Points per Correct Pick | Total Possible |
|--------|----------------------|----------------|
| Round 1 | 1 point | 32 points |
| Round 2 | 2 points | 32 points |
| Sweet 16 | 4 points | 32 points |
| Elite 8 | 8 points | 32 points |
| Final 4 | 16 points | 32 points |
| Championship | 32 points | 32 points |
| **Total** | | **192 points** |

## 🔧 Configuration Files

### Google Sheets Structure
- **Brackets Sheet**: User predictions and scores
- **Results Sheet**: Tournament results
- **Users Sheet**: Participant information
- **Settings Sheet**: Configuration data

### Deployment Files
- `netlify.toml`: Netlify configuration
- `vercel.json`: Vercel configuration
- `.github/workflows/deploy.yml`: GitHub Actions workflow

## 🌐 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🔒 Security Notes

- Google Sheets API keys should be secured with environment variables
- Never commit API keys to version control
- Use HTTPS in production
- Implement proper CORS headers

## 📱 Mobile Responsive

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Touch devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the deployment guide (`deploy.html`)
2. Review Google Sheets setup instructions
3. Test locally first
4. Check browser console for errors

---

**🏀 Enjoy your March Madness 2026 tournament tracking!**
