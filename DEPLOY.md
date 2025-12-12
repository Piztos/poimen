# Guia de Deploy - Poimén

## 📋 Índice

1. [Deploy Web (Frontend)](#deploy-web-frontend)
2. [Deploy Backend](#deploy-backend)
3. [Deploy Full Stack](#deploy-full-stack)
4. [Configurações de Produção](#configurações-de-produção)
5. [Monitoramento](#monitoramento)

---

## Deploy Web (Frontend)

### Netlify (Recomendado - Gratuito)

#### Via CLI

```powershell
# 1. Instale Netlify CLI
npm install -g netlify-cli

# 2. Build frontend
cd frontend
npm run build

# 3. Login
netlify login

# 4. Deploy
netlify deploy --prod --dir=dist
```

#### Via Git

1. Crie conta em [netlify.com](https://netlify.com)
2. New site from Git
3. Conecte GitHub/GitLab
4. Configure:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/dist`
   - **Branch**: `main`

### Vercel (Alternativa Gratuita)

```powershell
# 1. Instale Vercel CLI
npm install -g vercel

# 2. Build frontend
cd frontend
npm run build

# 3. Deploy
vercel --prod
```

### GitHub Pages (Grátis para repositórios públicos)

```powershell
# 1. Build
cd frontend
npm run build

# 2. Instale gh-pages
npm install -D gh-pages

# 3. Adicione script ao package.json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}

# 4. Deploy
npm run deploy
```

### Cloudflare Pages (Gratuito e Rápido)

1. Acesse [pages.cloudflare.com](https://pages.cloudflare.com)
2. Conecte GitHub
3. Configure:
   - **Build command**: `cd frontend && npm run build`
   - **Build output**: `frontend/dist`

---

## Deploy Backend

### Render.com (Recomendado - Gratuito)

1. Crie conta em [render.com](https://render.com)
2. New > Web Service
3. Conecte repositório GitHub
4. Configure:
   - **Name**: `poimen-backend`
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free
5. Adicione variáveis de ambiente:
   - `NODE_ENV=production`
   - `PORT=5000` (ou deixe automático)

### Railway.app (Alternativa Gratuita)

1. Crie conta em [railway.app](https://railway.app)
2. New Project > Deploy from GitHub
3. Selecione repositório
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Railway gera URL automaticamente

### Fly.io (Grátis com limites generosos)

```powershell
# 1. Instale Fly CLI
# Windows:
iwr https://fly.io/install.ps1 -useb | iex

# 2. Login
fly auth login

# 3. Configure app
cd backend
fly launch

# 4. Deploy
fly deploy
```

### Heroku (Alternativa - Planos pagos)

```powershell
# 1. Instale Heroku CLI
# Windows: Baixe de heroku.com/cli

# 2. Login
heroku login

# 3. Crie app
heroku create poimen-backend

# 4. Deploy
cd backend
git init
heroku git:remote -a poimen-backend
git add .
git commit -m "Deploy backend"
git push heroku main
```

---

## Deploy Full Stack

### Render.com (Frontend + Backend)

**Backend**:
1. Deploy backend como Web Service (veja acima)
2. Anote a URL: `https://poimen-backend.onrender.com`

**Frontend**:
1. New > Static Site
2. Configure:
   - **Build Command**: `cd frontend && npm run build`
   - **Publish Directory**: `frontend/dist`
3. Adicione variável de ambiente:
   - `VITE_API_URL=https://poimen-backend.onrender.com`

### Vercel (Frontend) + Railway (Backend)

**Backend** em Railway (veja acima)

**Frontend** em Vercel:

```powershell
cd frontend

# Adicione variável de ambiente
vercel env add VITE_API_URL production

# Valor: URL do Railway
# Exemplo: https://poimen-backend.railway.app

# Deploy
vercel --prod
```

### Netlify (Frontend) + Render (Backend)

**Backend** em Render (veja acima)

**Frontend** em Netlify:

1. Build settings:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/dist`
2. Environment variables:
   - `VITE_API_URL`: URL do Render

---

## Configurações de Produção

### Frontend (.env.production)

Crie `frontend/.env.production`:

```env
VITE_API_URL=https://seu-backend.onrender.com
VITE_GEMINI_API_KEY=sua_chave_api_aqui
```

### Backend (.env)

Crie `backend/.env`:

```env
NODE_ENV=production
PORT=5000
ALLOWED_ORIGINS=https://seu-frontend.netlify.app,https://seu-dominio.com
GEMINI_API_KEY=sua_chave_api_aqui
```

### CORS em Produção

Edite `backend/src/server.js`:

```javascript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}

app.use(cors(corsOptions))
```

### Configurar Domínio Próprio

#### Frontend (Netlify)

1. Netlify Dashboard > Domain Settings
2. Add custom domain
3. Configure DNS:
   - **A Record**: `75.2.60.5`
   - Ou **CNAME**: `seu-site.netlify.app`

#### Backend (Render)

1. Render Dashboard > Settings
2. Custom Domain
3. Adicione domínio
4. Configure DNS:
   - **CNAME**: `seu-backend.onrender.com`

---

## Banco de Dados em Produção

### SQLite (Padrão - Funciona no Render)

SQLite funciona perfeitamente no Render.com Free Tier.

**Importante**: Os dados são perdidos se o serviço reiniciar após 15 minutos de inatividade.

### PostgreSQL Gratuito (Recomendado para produção)

#### ElephantSQL (20MB gratuito)

1. Crie conta em [elephantsql.com](https://elephantsql.com)
2. Create New Instance > Tiny Turtle (Free)
3. Copie a URL de conexão
4. Adicione ao backend:

```env
DATABASE_URL=postgres://user:pass@host/database
```

#### Render PostgreSQL (Gratuito)

1. No Render Dashboard
2. New > PostgreSQL
3. Free plan
4. Conecte ao backend automaticamente

#### Supabase (Gratuito até 500MB)

1. Crie conta em [supabase.com](https://supabase.com)
2. New Project
3. Copie Database URL
4. Use no backend

---

## Monitoramento

### Logs Backend (Render)

```powershell
# Visualizar logs em tempo real
# No Render Dashboard > Logs
```

### Health Check

Configure endpoint de health check:

```javascript
// backend/src/server.js já tem:
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})
```

Configure no Render:
- **Health Check Path**: `/api/health`

### Uptime Monitoring (Gratuito)

#### UptimeRobot

1. Crie conta em [uptimerobot.com](https://uptimerobot.com)
2. Add New Monitor
3. Monitor Type: HTTP(s)
4. URL: `https://seu-backend.onrender.com/api/health`
5. Interval: 5 minutos

#### Better Uptime

1. [betteruptime.com](https://betteruptime.com)
2. Gratuito até 10 monitores
3. Alertas via email/SMS

---

## CI/CD Automático

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy Poimén

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install and Build Frontend
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=frontend/dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## Checklist Final

Antes de colocar em produção:

- [ ] Frontend buildado e testado
- [ ] Backend funcionando com banco de dados
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] HTTPS ativado (automático em Netlify/Render)
- [ ] Domínio próprio configurado (opcional)
- [ ] Monitoring ativo
- [ ] Backups configurados (para banco de dados)
- [ ] Health check funcionando
- [ ] Logs acessíveis

---

## Custos Mensais (Gratuito)

| Serviço | Custo | Limites |
|---------|-------|---------|
| Netlify | **R$ 0** | 100GB bandwidth, builds ilimitados |
| Render.com | **R$ 0** | 750h/mês, 512MB RAM |
| Railway.app | **R$ 0** | $5 crédito mensal |
| ElephantSQL | **R$ 0** | 20MB dados |
| Supabase | **R$ 0** | 500MB dados |

**Total: R$ 0 por mês** ✅

---

## Suporte

Problemas com deploy?

1. Verifique logs do serviço
2. Confira variáveis de ambiente
3. Teste endpoints manualmente
4. Abra issue no GitHub
5. Email: suporte@poimen.app

---

**Deploy completo em menos de 30 minutos!** 🚀
