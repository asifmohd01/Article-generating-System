@echo off
REM Start the server in the background
cd /d "c:\Users\asifm\OneDrive\Desktop\Article Generating Syetem\server"
start "Article Generator Server" cmd /c npm start

REM Wait for server to start
timeout /t 3 /nobreak

REM Run tests
node quick-test.js

REM Keep window open
pause
