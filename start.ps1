# Script de inicialização rápida do Poimén
# Execute: .\start.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Poimén - Sistema de Estudos Bíblicos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale Node.js 18+ de: https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion encontrado" -ForegroundColor Green

# Verificar se dependências estão instaladas
Write-Host ""
Write-Host "Verificando dependências..." -ForegroundColor Yellow

$frontendNodeModules = Test-Path "frontend\node_modules"
$backendNodeModules = Test-Path "backend\node_modules"

if (-not $frontendNodeModules -or -not $backendNodeModules) {
    Write-Host "⚠️  Dependências não instaladas. Instalando..." -ForegroundColor Yellow
    Write-Host ""
    npm run install:all
    Write-Host ""
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "✅ Dependências já instaladas" -ForegroundColor Green
}

# Criar arquivo .env se não existir
if (-not (Test-Path "backend\.env")) {
    Write-Host ""
    Write-Host "Criando arquivo .env para o backend..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✅ Arquivo .env criado" -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env")) {
    Write-Host "Criando arquivo .env para o frontend..." -ForegroundColor Yellow
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "✅ Arquivo .env criado" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Iniciando Poimén..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Yellow
Write-Host ""

# Iniciar frontend e backend
npm run dev
