@echo off
echo Starting HTTP Server for Hamilton Softball Scheduler...
echo.
echo Trying to start server on port 8080...
echo.

REM Try Python first
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python found, starting server...
    python -m http.server 8080
    goto :end
)

REM Try py command
py --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python (py) found, starting server...
    py -m http.server 8080
    goto :end
)

REM Try python3
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python3 found, starting server...
    python3 -m http.server 8080
    goto :end
)

echo No Python found. Please install Python or use a different web server.
echo You can also open index.html directly in your browser.
pause

:end
