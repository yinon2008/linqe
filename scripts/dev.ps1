# Linqe — Dev Server (PowerShell)
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

try { node --version | Out-Null } catch {
    Write-Host "[ERROR] Node.js not found. Run setup.ps1 first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path (Join-Path $root "node_modules"))) {
    Write-Host "[WARN] node_modules not found. Running npm install..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path (Join-Path $root ".env.local"))) {
    Write-Host "[WARN] .env.local not found. API calls will fail without it." -ForegroundColor Yellow
}

Write-Host "Starting dev server at http://localhost:3000 ..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop.`n"
npm run dev
