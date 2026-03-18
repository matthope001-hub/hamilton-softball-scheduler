Write-Host "Starting HTTP Server for Hamilton Softball Scheduler..."
Write-Host "Trying to start server on port 8080..."

# Try Python first
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Python found, starting server..."
        python -m http.server 8080
        exit
    }
} catch {
    Write-Host "Python not found"
}

# Try py command
try {
    $pyVersion = py --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Python (py) found, starting server..."
        py -m http.server 8080
        exit
    }
} catch {
    Write-Host "Python (py) not found"
}

# Try python3
try {
    $python3Version = python3 --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Python3 found, starting server..."
        python3 -m http.server 8080
        exit
    }
} catch {
    Write-Host "Python3 not found"
}

Write-Host "No Python found. Please install Python or use a different web server."
Write-Host "You can also open standalone.html directly in your browser."
Read-Host "Press Enter to exit"
