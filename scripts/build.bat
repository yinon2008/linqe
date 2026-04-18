@echo off
setlocal

echo ============================================
echo  Linqe — Production Build
echo ============================================

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  pause
  exit /b 1
)

cd /d "%~dp0.."
call npm run build
if errorlevel 1 (
  echo [ERROR] Build failed. Check the output above.
  pause
  exit /b 1
)

echo.
echo [OK] Build complete. Run scripts\start.bat to serve it.
pause
