# Linqe — Setup Script (PowerShell)
$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Linqe — Setup" -ForegroundColor Cyan
Write-Host "============================================"

# Check Node.js
try {
    $nodeVer = node --version 2>&1
    Write-Host "[OK] Node.js $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed." -ForegroundColor Red
    Write-Host "Download it from https://nodejs.org (LTS) and re-run this script."
    exit 1
}

# Install dependencies
$root = Split-Path $PSScriptRoot -Parent
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
Set-Location $root
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] npm install failed." -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Dependencies installed." -ForegroundColor Green

# Copy .env
$envFile = Join-Path $root ".env.local"
$envExample = Join-Path $root ".env.local.example"
if (-not (Test-Path $envFile)) {
    if (Test-Path $envExample) {
        Copy-Item $envExample $envFile
        Write-Host "[OK] Created .env.local from example — fill in your keys." -ForegroundColor Green
    } else {
        Write-Host "[WARN] .env.local.example not found. Create .env.local manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "[OK] .env.local already exists." -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Setup complete!" -ForegroundColor Green
Write-Host " Next steps:"
Write-Host "   1. Edit .env.local and fill in your API keys"
Write-Host "   2. Run: .\scripts\dev.ps1"
Write-Host "============================================"
