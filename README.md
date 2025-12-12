# Poimén - Sistema de Estudos Bíblicos Reformados

![Poimén Logo](docs/logo.png)

**Poimén** (ποιμήν - "pastor" em grego) é um sistema completo, multiplataforma e **totalmente gratuito** para estudos bíblicos reformados com múltiplas IAs gratuitas.

## 🌟 Características

- ✅ **100% Gratuito** - Sem custos, sem planos pagos, sem limites
- 🤖 **Múltiplas IAs** - Google Gemini, ChatGPT, DeepSeek, Microsoft Copilot
- 📱 **Multiplataforma** - Web, Windows, Linux, macOS, Android, iOS
- 📖 **Teologia Reformada** - Baseado nos maiores mestres reformados
- 📝 **Análise Profunda** - Exegese histórica, gramatical, literária e sistemática
- 💾 **Exportação Completa** - PDF, DOCX, Google Docs, Markdown, TXT
- 🎨 **Interface Moderna** - Design responsivo e intuitivo
- 🔒 **Open Source** - Código aberto e auditável

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org))
- npm ou yarn

### Instalação Rápida

```powershell
# 1. Clone ou baixe o projeto
cd Poimen

# 2. Instale todas as dependências
npm run install:all

# 3. Inicie o sistema completo
npm run dev
```

O sistema abrirá automaticamente em `http://localhost:3000`

## 📦 Estrutura do Projeto

```
Poimen/
├── frontend/          # Interface React + Vite
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── services/     # Serviços e APIs
│   │   └── styles/       # Estilos globais
│   └── dist/             # Build de produção
├── backend/           # API Node.js + Express
│   ├── src/
│   │   ├── controllers/  # Controladores
│   │   ├── routes/       # Rotas da API
│   │   └── database/     # SQLite database
│   └── database/         # Arquivos do banco
├── desktop/           # Aplicação Electron
│   ├── main.js          # Processo principal
│   └── preload.js       # Script de preload
├── mobile/            # Aplicação Capacitor
│   └── capacitor.config.json
└── docs/              # Documentação
```

## 🖥️ Executando Localmente

### Frontend (React)

```powershell
cd frontend
npm install
npm run dev
```

Acesse: `http://localhost:3000`

### Backend (Node.js)

```powershell
cd backend
npm install
npm run dev
```

API rodando em: `http://localhost:5000`

### Full Stack

```powershell
# Da raiz do projeto
npm run dev
```

## 🏗️ Build para Produção

### Web Build

```powershell
cd frontend
npm run build
```

Os arquivos estarão em `frontend/dist/`

### Desktop Build

#### Windows

```powershell
cd desktop
npm install
npm run build:win
```

Executáveis em `desktop/dist/`

#### Linux

```powershell
cd desktop
npm run build:linux
```

Formatos: AppImage, deb, rpm

#### macOS

```powershell
cd desktop
npm run build:mac
```

Formatos: dmg, zip

### Mobile Build

#### Android

```powershell
cd mobile
npm install
npx cap add android
npx cap sync android
npx cap open android
```

No Android Studio, faça o build do APK.

#### iOS

```powershell
cd mobile
npm install
npx cap add ios
npx cap sync ios
npx cap open ios
```

No Xcode, faça o build do IPA.

## 🌐 Deploy Gratuito

### Frontend (Netlify/Vercel)

#### Netlify

```powershell
# Build
cd frontend
npm run build

# Deploy
npx netlify-cli deploy --prod --dir=dist
```

#### Vercel

```powershell
cd frontend
npx vercel --prod
```

### Backend (Render/Railway)

#### Render.com

1. Crie conta em [render.com](https://render.com)
2. Novo Web Service
3. Conecte repositório GitHub
4. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node

#### Railway.app

1. Crie conta em [railway.app](https://railway.app)
2. New Project > Deploy from GitHub
3. Selecione o repositório
4. Configure root directory: `backend`

### Frontend + Backend (Heroku gratuito alternativo)

Use **Render.com** que oferece:
- ✅ 750 horas/mês gratuitas
- ✅ SSL automático
- ✅ Deploy automático

## 🤖 Configuração das IAs

### Google Gemini (API Gratuita)

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma API Key gratuita
3. No sistema Poimén, vá em Configurações
4. Insira a API Key do Gemini
5. ✅ Pronto! Análises automáticas ilimitadas

### ChatGPT, DeepSeek, Copilot (Interface Web)

Essas IAs usam a **interface web gratuita**:

1. O sistema abre automaticamente a IA em nova aba
2. Cole o prompt do agente Poimén no chat
3. Copie a resposta completa
4. Cole de volta no sistema Poimén
5. ✅ Análise completa sem custos!

## 📖 Como Usar

### 1. Análise Bíblica

1. **Insira o Texto Bíblico**
   - Cole a perícope que deseja estudar
   - Versão NVI recomendada

2. **Selecione as IAs**
   - Escolha uma ou mais IAs gratuitas
   - Gemini, ChatGPT, DeepSeek, Copilot

3. **Analise**
   - Clique em "Analisar com IAs Selecionadas"
   - O agente Poimén será automaticamente injetado

4. **Receba Resultados**
   - Veja análises lado a lado
   - Compare diferentes perspectivas

5. **Exporte**
   - PDF para impressão
   - DOCX para edição
   - Google Docs para colaboração
   - Markdown para desenvolvedores
   - TXT para simplicidade

### 2. Agente Poimén

O agente Poimén realiza:

- ✅ **Estruturação de Sermão Expositivo**
  - Introdução cativante
  - Desenvolvimento em 3 pontos
  - Conclusão aplicativa

- ✅ **Contexto Histórico**
  - Fatos históricos verificados
  - Cultura e geografia
  - Fontes acadêmicas

- ✅ **Análise Sintática/Gramatical**
  - Textos originais (hebraico, grego, aramaico)
  - Raízes e variantes
  - Construções sintáticas

- ✅ **Explicação Pastoral**
  - Linguagem simples
  - Conteúdo profundo
  - Conexão com Cristo

- ✅ **Aplicação Prática**
  - Exemplos contemporâneos
  - Situações paralelas
  - Chamado à resposta

## 🔧 Configuração Avançada

### Variáveis de Ambiente

Crie `.env` no backend:

```env
NODE_ENV=production
PORT=5000
GEMINI_API_KEY=sua_chave_aqui
```

### Frontend Personalizado

Edite `frontend/src/services/aiService.js` para adicionar novas IAs.

### Banco de Dados

O sistema usa SQLite por padrão. Para PostgreSQL:

1. Instale `pg` no backend
2. Edite `backend/src/database/init.js`
3. Configure conexão PostgreSQL

## 📚 Documentação Completa

### Comandos Úteis

```powershell
# Instalar tudo de uma vez
npm run install:all

# Rodar frontend e backend simultaneamente
npm run dev

# Build completo
npm run build

# Apenas frontend
npm run dev:frontend

# Apenas backend
npm run dev:backend

# Build desktop Windows
cd desktop && npm run build:win

# Build desktop Linux
cd desktop && npm run build:linux

# Build desktop macOS
cd desktop && npm run build:mac
```

### Scripts Disponíveis

#### Raiz do Projeto

- `npm run install:all` - Instala dependências de tudo
- `npm run dev` - Roda frontend + backend
- `npm run build` - Build de produção completo

#### Frontend

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build

#### Backend

- `npm run dev` - Servidor com nodemon
- `npm run start` - Servidor de produção

#### Desktop

- `npm start` - Iniciar Electron
- `npm run build` - Build para todas plataformas
- `npm run build:win` - Build Windows
- `npm run build:mac` - Build macOS
- `npm run build:linux` - Build Linux

#### Mobile

- `npm run sync` - Sincronizar com plataformas
- `npm run sync:android` - Sync Android
- `npm run sync:ios` - Sync iOS
- `npm run open:android` - Abrir Android Studio
- `npm run open:ios` - Abrir Xcode

## 🎨 Customização

### Cores e Temas

Edite `frontend/src/styles/index.css`:

```css
:root {
  --primary-color: #1a1a2e;
  --secondary-color: #16213e;
  --accent-color: #0f3460;
  --highlight-color: #533483;
  /* ... */
}
```

### Adicionar Nova IA

1. Edite `frontend/src/components/AISelector.jsx`
2. Adicione configuração em `frontend/src/services/aiService.js`
3. Implemente lógica de integração

## 🐛 Resolução de Problemas

### Erro: "Cannot find module"

```powershell
# Limpe node_modules e reinstale
Remove-Item -Recurse -Force node_modules
npm install
```

### Backend não inicia

```powershell
# Verifique porta 5000
netstat -ano | findstr :5000

# Mate processo se necessário
taskkill /PID [PID] /F
```

### Build Electron falha

```powershell
# Instale dependências do Electron
cd desktop
Remove-Item -Recurse -Force node_modules
npm install
```

### Mobile não sincroniza

```powershell
cd mobile
npx cap sync
# Se persistir:
Remove-Item -Recurse -Force android, ios
npx cap add android
npx cap add ios
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

### Autores Reformados

Este sistema é fundamentado nos ensinamentos de:

- João Calvino, Charles Spurgeon, John Piper, Timothy Keller
- D.A. Carson, J.I. Packer, John Stott, Wayne Grudem
- Herman Bavinck, Louis Berkhof, Augustus Nicodemus
- E muitos outros mestres da fé reformada

### Tecnologias

Agradecemos aos projetos open-source:

- React, Vite, Node.js, Express
- Electron, Capacitor
- SQLite, Better-SQLite3
- Marked, DOMPurify, html2pdf.js, docx

## 📞 Suporte

- 📧 Email: suporte@poimen.app
- 💬 GitHub Issues: [Criar Issue](https://github.com/seu-usuario/poimen/issues)
- 📖 Documentação: [Wiki do Projeto](https://github.com/seu-usuario/poimen/wiki)

## 🌍 Roadmap

### Versão 1.1 (Planejado)

- [ ] Suporte a mais IAs gratuitas
- [ ] Sistema de anotações
- [ ] Compartilhamento de análises
- [ ] Modo offline completo
- [ ] Temas personalizáveis
- [ ] Sincronização em nuvem (gratuita)

### Versão 2.0 (Futuro)

- [ ] Análise em tempo real
- [ ] Colaboração em equipe
- [ ] Plugin para Obsidian/Notion
- [ ] API pública
- [ ] Marketplace de templates de sermão

---

**Feito com ❤️ para a glória de Deus**

*Sistema totalmente gratuito e open-source*

**Poimén** - ποιμήν - Construtor do Conhecimento Teológico
