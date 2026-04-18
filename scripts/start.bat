@echo off
setlocal

echo ============================================
echo  Linqe — Production Server
echo ============================================

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  pause
  exit /b 1
)

if not exist "%~dp0..\.next" (
  echo [ERROR] No build found. Run scripts\build.bat first.
  pause
  exit /b 1
)

echo Starting production server at http://localhost:3000 ...
echo Press Ctrl+C to stop.
echo.
cd /d "%~dp0.."
npm start
