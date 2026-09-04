@echo off
title Push Move India to GitHub
color 0B

echo =======================================================
echo     PUSH MOVE INDIA CLEAN CODEBASE TO GITHUB
echo =======================================================
echo.
echo Your repository: https://github.com/paladirevanthsai-star/MoveIndia
echo.
echo To push securely to GitHub, GitHub requires a Personal Access Token:
echo 1. Open: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Check "repo" scope and click "Generate token"
echo 4. Copy the token (starts with ghp_...)
echo.
set /p GITHUB_TOKEN="Paste your GitHub Token here: "

if "%GITHUB_TOKEN%"=="" (
    echo No token entered. Exiting...
    pause
    exit /b
)

echo.
echo Pushing clean codebase (with client/ and server/ folders) to GitHub...
echo.

"%USERPROFILE%\mingit\cmd\git.exe" push https://paladirevanthsai-star:%GITHUB_TOKEN%@github.com/paladirevanthsai-star/MoveIndia.git main --force

echo.
if %ERRORLEVEL% equ 0 (
    echo =======================================================
    echo SUCCESS! Code successfully pushed to GitHub!
    echo Render will now build and deploy automatically!
    echo =======================================================
) else (
    echo PUSH FAILED! Please check if your token is valid and has "repo" permissions.
)

echo.
pause
