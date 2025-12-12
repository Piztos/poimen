# Guia de Instalação - Poimén

## 📋 Índice

1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Instalação Windows](#instalação-windows)
3. [Instalação Linux](#instalação-linux)
4. [Instalação macOS](#instalação-macos)
5. [Instalação Android](#instalação-android)
6. [Instalação iOS](#instalação-ios)
7. [Solução de Problemas](#solução-de-problemas)

---

## Requisitos do Sistema

### Para Desenvolvimento

- **Node.js** 18.0.0 ou superior
- **npm** 9.0.0 ou superior (vem com Node.js)
- **Git** (opcional, para clonar repositório)

### Para Uso (Executáveis)

- **Windows**: Windows 10/11 (64-bit)
- **Linux**: Ubuntu 20.04+, Fedora 36+, ou equivalente
- **macOS**: macOS 10.15 (Catalina) ou superior
- **Android**: Android 7.0 (Nougat) ou superior
- **iOS**: iOS 13 ou superior

---

## Instalação Windows

### Opção 1: Executável (Recomendado)

1. Baixe `Poimen-Setup-1.0.0.exe` da [página de releases](https://github.com/seu-usuario/poimen/releases)
2. Execute o instalador
3. Siga as instruções na tela
4. Inicie o Poimén pelo menu Iniciar

### Opção 2: Desenvolvimento

```powershell
# 1. Instale Node.js
# Baixe de: https://nodejs.org

# 2. Clone ou baixe o projeto
cd C:\pasta\do\projeto\Poimen

# 3. Instale dependências
npm run install:all

# 4. Inicie o sistema
npm run dev

# 5. Acesse no navegador
# http://localhost:3000
```

### Build Desktop Windows

```powershell
# Build do frontend
cd frontend
npm run build

# Build Electron
cd ..\desktop
npm install
npm run build:win

# Executável estará em desktop/dist/
```

---

## Instalação Linux

### Opção 1: AppImage (Universal)

```bash
# 1. Baixe Poimen-1.0.0.AppImage
wget https://github.com/seu-usuario/poimen/releases/download/v1.0.0/Poimen-1.0.0.AppImage

# 2. Dê permissão de execução
chmod +x Poimen-1.0.0.AppImage

# 3. Execute
./Poimen-1.0.0.AppImage
```

### Opção 2: Pacote DEB (Debian/Ubuntu)

```bash
# 1. Baixe o .deb
wget https://github.com/seu-usuario/poimen/releases/download/v1.0.0/poimen_1.0.0_amd64.deb

# 2. Instale
sudo dpkg -i poimen_1.0.0_amd64.deb

# 3. Resolva dependências se necessário
sudo apt-get install -f

# 4. Execute
poimen
```

### Opção 3: Desenvolvimento

```bash
# 1. Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clone projeto
git clone https://github.com/seu-usuario/poimen.git
cd poimen

# 3. Instale dependências
npm run install:all

# 4. Inicie
npm run dev
```

### Build Desktop Linux

```bash
# Build frontend
cd frontend
npm run build

# Build Electron
cd ../desktop
npm install
npm run build:linux

# Arquivos em desktop/dist/
```

---

## Instalação macOS

### Opção 1: DMG (Recomendado)

1. Baixe `Poimen-1.0.0.dmg`
2. Abra o arquivo DMG
3. Arraste Poimén para Aplicativos
4. Abra Poimén da pasta Aplicativos

**Nota**: Na primeira execução, você pode precisar:
- Clicar com botão direito > Abrir
- Ou ir em Preferências do Sistema > Segurança e permitir

### Opção 2: Desenvolvimento

```bash
# 1. Instale Node.js
# Baixe de: https://nodejs.org
# Ou use Homebrew:
brew install node

# 2. Clone projeto
git clone https://github.com/seu-usuario/poimen.git
cd poimen

# 3. Instale dependências
npm run install:all

# 4. Inicie
npm run dev
```

### Build Desktop macOS

```bash
# Build frontend
cd frontend
npm run build

# Build Electron
cd ../desktop
npm install
npm run build:mac

# DMG estará em desktop/dist/
```

---

## Instalação Android

### Opção 1: APK Direto

1. Baixe `Poimen-1.0.0.apk`
2. Habilite "Fontes Desconhecidas" nas Configurações
3. Instale o APK
4. Abra Poimén

### Opção 2: Google Play Store

*(Quando disponível)*

1. Busque "Poimén" na Play Store
2. Toque em Instalar
3. Abra o app

### Opção 3: Build Manual

```bash
# 1. Instale Node.js e Android Studio

# 2. Configure projeto
cd poimen/mobile
npm install

# 3. Adicione plataforma Android
npx cap add android

# 4. Sincronize
npx cap sync android

# 5. Abra no Android Studio
npx cap open android

# 6. No Android Studio:
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

---

## Instalação iOS

### Opção 1: App Store

*(Quando disponível)*

1. Busque "Poimén" na App Store
2. Toque em Obter
3. Instale o app

### Opção 2: Build Manual (Requer Mac)

```bash
# 1. Instale Xcode da App Store

# 2. Instale CocoaPods
sudo gem install cocoapods

# 3. Configure projeto
cd poimen/mobile
npm install

# 4. Adicione plataforma iOS
npx cap add ios

# 5. Sincronize
npx cap sync ios

# 6. Abra no Xcode
npx cap open ios

# 7. No Xcode:
# - Configure sua equipe de desenvolvimento
# - Conecte dispositivo iOS ou use simulador
# - Product > Build (Cmd+B)
# - Product > Run (Cmd+R)
```

---

## Solução de Problemas

### Windows

**Problema**: "Node não é reconhecido como comando"

```powershell
# Reinstale Node.js e reinicie o terminal
# Ou adicione ao PATH manualmente
```

**Problema**: Erro de permissão ao instalar

```powershell
# Execute PowerShell como Administrador
```

### Linux

**Problema**: Erro ao executar AppImage

```bash
# Instale FUSE
sudo apt-get install libfuse2

# Ou extraia e execute diretamente
./Poimen-1.0.0.AppImage --appimage-extract
./squashfs-root/poimen
```

**Problema**: `npm: command not found`

```bash
# Instale Node.js corretamente
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### macOS

**Problema**: "Não é possível abrir porque é de desenvolvedor não identificado"

```bash
# Remova quarentena
xattr -cr /Applications/Poimen.app

# Ou abra com Ctrl+Clique > Abrir
```

**Problema**: Porta 5000 em uso

```bash
# Mate processo na porta 5000
lsof -ti:5000 | xargs kill -9
```

### Android

**Problema**: "App não instalado"

- Desinstale versão anterior
- Limpe cache da Play Store
- Habilite "Fontes Desconhecidas"

**Problema**: Build falha no Android Studio

```bash
# Limpe projeto
./gradlew clean

# Reconstrua
./gradlew build
```

### iOS

**Problema**: "No developer program membership"

- Configure uma Apple ID gratuita no Xcode
- Ou use conta de desenvolvedor paga

**Problema**: CocoaPods erro

```bash
# Atualize CocoaPods
sudo gem install cocoapods

# Limpe cache
pod cache clean --all
```

---

## Suporte

Se você encontrar problemas não listados aqui:

1. Verifique as [Issues no GitHub](https://github.com/seu-usuario/poimen/issues)
2. Crie uma nova issue com detalhes do problema
3. Entre em contato: suporte@poimen.app

---

**Última atualização**: Dezembro 2025
