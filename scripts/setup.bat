@echo off
setlocal

echo ============================================
echo  Linqe — Setup
echo ============================================

:: Check Node.js
where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  echo Download it from https://nodejs.org ^(LTS^) and re-run this script.
  pause
  exit /b 1
)

for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo [OK] Node.js %NODE_VER%

:: Check npm
where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm not found. Re-install Node.js.
  pause
  exit /b 1
)

:: Install dependencies
echo.
echo Installing dependencies...
cd /d "%~dp0.."
call npm install
if errorlevel 1 (
  echo [ERROR] npm install failed.
  pause
  exit /b 1
)
echo [OK] Dependencies installed.

:: Copy .env if missing
if not exist ".env.local" (
  if exist ".env.local.example" (
    copy ".env.local.example" ".env.local" >nul
    echo [OK] Created .env.local from example — fill in your keys.
  ) else (
    echo [WARN] .env.local.example not found. Create .env.local manually.
  )
) else (
  echo [OK] .env.local already exists.
)

echo.
echo ============================================
echo  Setup complete!
echo  Next steps:
echo    1. Edit .env.local and fill in your API keys
echo    2. Run scripts\dev.bat to start the dev server
echo ============================================
pause
