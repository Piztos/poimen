# 🚀 Deploy Rápido do Poimen - 3 Passos

## 1️⃣ Subir para GitHub (5 minutos)

```powershell
cd "C:\pav\Fluxo de Atendimento\Pessoal\python\novos_programas\Poimen"
git init
git add .
git commit -m "Poimen v1.0 - Sistema de análise bíblica com RAG"
```

Crie repositório em: https://github.com/new

```powershell
git remote add origin https://github.com/Piztos/poimen.git
git branch -M main
git push -u origin main
```

## 2️⃣ Deploy Backend no Render (10 minutos)

1. Acesse: https://render.com/
2. **New** → **Web Service**
3. **Connect repository** → Selecione `poimen`
4. Configurações:
   - **Name**: `poimen-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. **Environment Variables**:
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = (deixe vazio por enquanto)
6. **Create Web Service**
7. **COPIE A URL**: https://poimen-backend.onrender.com

## 3️⃣ Deploy Frontend no cPanel (5 minutos)

1. **Configure a URL do backend**:
```powershell
cd frontend
```

Crie arquivo `.env`:
```
VITE_API_URL=https://poimen-backend.onrender.com
```

2. **Rebuilde o frontend**:
```powershell
npm run build
```

3. **Acesse seu cPanel**:
   - URL: https://poimen.com.br:2083
   - Painel: jupiter
   - **File Manager** → **public_html**

4. **Limpe e faça upload**:
   - Delete todos os arquivos em `public_html`
   - Upload todos os arquivos de `frontend/dist/*`
   - ⚠️ Arquivos dentro de dist, não a pasta dist!

## ✅ PRONTO!

Seu site estará online em:
- **Frontend**: https://poimen.com.br
- **Backend**: https://poimen-backend.onrender.com

## 📝 Pós-Deploy

Volte ao Render e atualize a variável:
- `FRONTEND_URL` = `https://poimen.com.br`

---

## ⚠️ IMPORTANTE

**Backend no Render (grátis):**
- Dorme após 15min sem uso
- Primeira requisição demora ~30s para "acordar"
- Depois funciona normalmente

**Alternativa SEM LIMITAÇÃO:** Railway ($ limitado mas mais rápido)
- https://railway.app
- Deploy em 1 clique do GitHub
- Não dorme
