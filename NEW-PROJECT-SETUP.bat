@echo off
echo 🚀 Start New Project Setup
echo.

echo 📋 Step 1: Navigate to Projects Directory
cd C:\Users\HopeMa\CascadeProjects
echo.

echo 📋 Step 2: Create New Project Directory
set /p project_name="Enter your new project name: "
if "%project_name%"=="" (
    echo ❌ Project name cannot be empty
    pause
    exit /b 1
)

mkdir "%project_name%" 2>nul
if %errorlevel% neq 0 (
    echo ❌ Failed to create directory. It may already exist.
    pause
    exit /b 1
)

echo ✅ Created project: %project_name%
echo.

echo 📋 Step 3: Navigate to New Project
cd "%project_name%"
echo.

echo 📋 Step 4: Initialize Git Repository
git init
echo.

echo 📋 Step 5: Create Basic Files
echo # %project_name% > README.md
echo. > .gitignore
echo node_modules/ >> .gitignore
echo .DS_Store >> .gitignore
echo *.log >> .gitignore

echo ✅ Basic project structure created
echo.

echo 📋 Step 6: Project Options
echo.
echo 🎯 What type of project would you like to create?
echo.
echo 1. Web Application (HTML/CSS/JS)
echo 2. React Application
echo 3. Node.js API
echo 4. Python Application
echo 5. Data Science Project
echo 6. Custom Project
echo.
set /p project_type="Enter your choice (1-6): "

if "%project_type%"=="1" goto web_app
if "%project_type%"=="2" goto react_app
if "%project_type%"=="3" goto node_api
if "%project_type%"=="4" goto python_app
if "%project_type%"=="5" goto data_science
if "%project_type%"=="6" goto custom_project

:web_app
echo 🌐 Creating Web Application template...
echo <!DOCTYPE html> > index.html
echo ^<html^> >> index.html
echo ^<head^> >> index.html
echo ^<title^>%project_name%^</title^> >> index.html
echo ^</head^> >> index.html
echo ^<body^> >> index.html
echo ^<h1^>Welcome to %project_name%^</h1^> >> index.html
echo ^</body^> >> index.html
echo ^</html^> >> index.html
echo * { margin: 0; padding: 20px; font-family: Arial, sans-serif; } > style.css
echo body { background: #f0f0f0; } >> style.css
echo h1 { color: #333; } >> style.css
echo console.log('Welcome to %project_name%'); > script.js
goto setup_complete

:react_app
echo ⚛️ Creating React Application template...
echo npx create-react-app . --template typescript
goto setup_complete

:node_api
echo 🔧 Creating Node.js API template...
echo { > package.json
echo   "name": "%project_name%", >> package.json
echo   "version": "1.0.0", >> package.json
echo   "main": "index.js", >> package.json
echo   "scripts": { "start": "node index.js" } >> package.json
echo } >> package.json
echo const express = require('express'); > index.js
echo const app = express(); >> index.js
echo const port = 3000; >> index.js
echo app.get('/', (req, res) => res.send('Welcome to %project_name%')); >> index.js
echo app.listen(port, () => console.log('%project_name% running on port ' + port)); >> index.js
goto setup_complete

:python_app
echo 🐍 Creating Python Application template...
echo # %project_name% > app.py
echo def main(): >> app.py
echo     print("Welcome to %project_name%") >> app.py
echo if __name__ == "__main__": >> app.py
echo     main() >> app.py
echo requests > requirements.txt
goto setup_complete

:data_science
echo 📊 Creating Data Science template...
echo # %project_name% Data Analysis > analysis.ipynb
echo import pandas as pd >> analysis.ipynb
echo import matplotlib.pyplot as plt >> analysis.ipynb
goto setup_complete

:custom_project
echo 🎨 Creating custom project...
echo # %project_name% > README.md
echo Describe your project here... >> README.md
goto setup_complete

:setup_complete
echo.
echo ✅ Project %project_name% created successfully!
echo.
echo 📁 Location: C:\Users\HopeMa\CascadeProjects\%project_name%
echo 📋 Next steps:
echo 1. Open Windsurf
echo 2. Navigate to your new project
echo 3. Start building!
echo.
echo 🌐 Would you like to create a GitHub repository for this project?
set /p create_repo="Create GitHub repo now? (y/n): "
if /i "%create_repo%"=="y" (
    echo 🚀 Opening GitHub to create repository...
    start https://github.com/new
)

echo.
echo 🎉 New project setup complete!
echo 📁 Your March Madness project is saved at:
echo    C:\Users\HopeMa\CascadeProjects\windsurf-project-2
echo.
echo 🚀 Your new project is ready at:
echo    C:\Users\HopeMa\CascadeProjects\%project_name%
echo.
pause
