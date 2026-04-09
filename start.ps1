Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Student Application Tracker" -ForegroundColor Cyan
Write-Host "  One-Click Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "[Info] Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[Error] Node.js not found. Please install Node.js first." -ForegroundColor Red
    pause
    exit 1
}

# Start backend server
Write-Host ""
Write-Host "[Info] Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

# Wait for backend
Write-Host "[Info] Waiting for backend initialization..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start frontend server
Write-Host ""
Write-Host "[Info] Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servers Starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173 (or 5174)" -ForegroundColor White
Write-Host ""
Write-Host "  Default Account:" -ForegroundColor White
Write-Host "  Teacher: admin / admin123" -ForegroundColor Green
Write-Host ""

# Wait and open browser
Start-Sleep -Seconds 3
Write-Host "[Info] Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Startup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[Note] Keep both PowerShell windows open" -ForegroundColor Yellow
Write-Host "[Note] Closing them will stop the servers" -ForegroundColor Yellow
Write-Host ""
