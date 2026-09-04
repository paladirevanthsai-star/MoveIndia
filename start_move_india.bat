@echo off
title Move India — Urban AI Sensing & Transit Platform
color 0A

echo =======================================================
echo          MOVE INDIA — URBAN AI SENSING PLATFORM
echo =======================================================
echo.
echo Starting Move India Unified Server on Port 5000...
echo.

cd /d "%~dp0\server"
start /min cmd /c "node index.js"

echo Waiting for server to initialize...
timeout /t 3 /nobreak >nul

echo Launching browser...
start http://localhost:5000

echo.
echo =======================================================
echo App is now LIVE!
echo - Desktop URL:  http://localhost:5000
echo - Mobile Wi-Fi: http://192.168.29.84:5000
echo =======================================================
echo.
echo Press any key to stop the server...
pause >nul

taskkill /f /im node.exe >nul 2>&1
echo Move India server stopped.
