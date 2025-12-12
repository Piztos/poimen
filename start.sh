#!/bin/bash

# Script de inicialização rápida do Poimén
# Execute: ./start.sh

echo "========================================"
echo "   Poimén - Sistema de Estudos Bíblicos"
echo "========================================"
echo ""

# Verificar Node.js
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "Por favor, instale Node.js 18+ de: https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION encontrado"

# Verificar se dependências estão instaladas
echo ""
echo "Verificando dependências..."

if [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Dependências não instaladas. Instalando..."
    echo ""
    npm run install:all
    echo ""
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "✅ Dependências já instaladas"
fi

# Criar arquivo .env se não existir
if [ ! -f "backend/.env" ]; then
    echo ""
    echo "Criando arquivo .env para o backend..."
    cp backend/.env.example backend/.env
    echo "✅ Arquivo .env criado"
fi

if [ ! -f "frontend/.env" ]; then
    echo "Criando arquivo .env para o frontend..."
    cp frontend/.env.example frontend/.env
    echo "✅ Arquivo .env criado"
fi

echo ""
echo "========================================"
echo "   Iniciando Poimén..."
echo "========================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo ""
echo "Pressione Ctrl+C para parar"
echo ""

# Iniciar frontend e backend
npm run dev
