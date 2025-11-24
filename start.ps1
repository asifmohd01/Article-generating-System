#!/usr/bin/env pwsh
# Healthy Gut AI - Startup Script for PowerShell

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          HEALTHY GUT AI - Starting Application               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if node is installed
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[INFO] Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PSScriptRoot\server'; npm run dev`"" -WindowTitle "Healthy Gut AI - Backend"

Write-Host "[INFO] Waiting 3 seconds..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host "[INFO] Starting frontend dev server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PSScriptRoot\client'; npm run dev`"" -WindowTitle "Healthy Gut AI - Frontend"

Write-Host "[INFO] Waiting for servers to start..." -ForegroundColor Gray
Start-Sleep -Seconds 5

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                  SERVERS STARTING                              ║" -ForegroundColor Cyan
Write-Host "╠════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║  Frontend: http://localhost:5173                              ║" -ForegroundColor Green
Write-Host "║  Backend:  http://localhost:4000                              ║" -ForegroundColor Green
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║  Opening browser in 3 seconds...                              ║" -ForegroundColor Yellow
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Start-Sleep -Seconds 3

# Open browser
Start-Process "http://localhost:5173"

Write-Host "[SUCCESS] Application is running!" -ForegroundColor Green
Write-Host "[INFO] Close these PowerShell windows to stop servers" -ForegroundColor Gray
Write-Host ""
