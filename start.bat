@echo off
REM Healthy Gut AI - Startup Script for Windows

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          HEALTHY GUT AI - Starting Application               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Starting backend server...
start "Healthy Gut AI - Backend" powershell -NoExit -Command "cd 'server'; npm run dev"

echo [INFO] Waiting 3 seconds...
timeout /t 3 /nobreak

echo [INFO] Starting frontend dev server...
start "Healthy Gut AI - Frontend" powershell -NoExit -Command "cd 'client'; npm run dev"

echo [INFO] Waiting for servers to start...
timeout /t 5 /nobreak

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                  SERVERS STARTING                              ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║                                                                ║
echo ║  Frontend: http://localhost:5173                              ║
echo ║  Backend:  http://localhost:4000                              ║
echo ║                                                                ║
echo ║  Opening browser in 3 seconds...                              ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

timeout /t 3 /nobreak

REM Open browser
start http://localhost:5173

echo [SUCCESS] Application is running!
echo [INFO] Press Ctrl+C in terminal windows to stop servers
echo.
