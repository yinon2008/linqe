@echo off
setlocal

echo ============================================
echo  Linqe — Dev Server
echo ============================================

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is not installed. Run scripts\setup.bat first.
  pause
  exit /b 1
)

if not exist "%~dp0..\node_modules" (
  echo [WARN] node_modules not found. Running npm install first...
  cd /d "%~dp0.."
  call npm install
)

if not exist "%~dp0..\.env.local" (
  echo [WARN] .env.local not found. Copy .env.local.example and fill in your keys.
)

echo Starting dev server at http://localhost:3000 ...
echo Press Ctrl+C to stop.
echo.
cd /d "%~dp0.."
npm run dev
