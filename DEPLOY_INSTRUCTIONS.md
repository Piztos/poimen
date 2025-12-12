# 🚀 Instruções de Deploy - Poimen v2.0

**Status Atual:**
- ✅ Código commitado no GitHub (commit: a99e605)
- ✅ Frontend buildado para produção
- ✅ Tema escuro aplicado na Landing Page
- ⏳ Aguardando upload para cPanel

---

## 📦 PASSO 1: Upload do Frontend para cPanel

### Acessar cPanel
1. Acesse: https://poimen.com.br:2083
2. Login: jupiter (painel cPanel)
3. Use sua senha do cPanel

### Fazer Upload dos Arquivos
1. No cPanel, clique em **"Gerenciador de Arquivos"** (File Manager)
2. Navegue até a pasta **`public_html`**
3. **IMPORTANTE:** Delete todos os arquivos antigos dentro de `public_html`
4. Clique em **"Upload"** no topo da tela
5. Selecione **TODOS os arquivos** de dentro da pasta:
   ```
   C:\pav\Fluxo de Atendimento\Pessoal\python\novos_programas\Poimen\frontend\dist
   ```
   
   **Arquivos a fazer upload:**
   - `index.html`
   - Pasta `assets/` (com todos os arquivos JS e CSS dentro)
   - `vite.svg` ou `favicon.svg` (se existir)
   - **NÃO faça upload da pasta "dist" em si, apenas o CONTEÚDO dela!**

6. Aguarde o upload completar (todos os arquivos devem estar na raiz de `public_html`)

### Verificar Estrutura Final
Dentro de `public_html` você deve ter:
```
public_html/
├── index.html
├── assets/
│   ├── index-U8kj-rrL.css
│   ├── html2canvas-Dhevse_v.js
│   ├── utils-ChGMflj7.js
│   ├── index.es-D9P-gl2r.js
│   ├── vendor-MWTLVteA.js
│   └── index-pO-NptgB.js
└── vite.svg (opcional)
```

---

## 🖥️ PASSO 2: Verificar Deploy do Backend no Render

### Acessar Render Dashboard
1. Acesse: https://dashboard.render.com
2. Login com sua conta GitHub
3. Procure o serviço **"poimen-backend"** ou similar

### Verificar Auto-Deploy
- O Render deve ter detectado automaticamente o commit `a99e605`
- Se NÃO houver deploy automático:
  1. Clique no serviço backend
  2. Clique em **"Manual Deploy"** → **"Deploy latest commit"**
  3. Aguarde o deploy completar (~2-5 minutos)

### Configurar Variáveis de Ambiente
No painel do Render, vá em **"Environment"** e verifique:

**Variáveis OBRIGATÓRIAS:**
```
PORT=5000
FRONTEND_URL=https://poimen.com.br
JWT_SECRET=(sua chave secreta - já deve estar configurada)
```

**Variáveis OPCIONAIS (para envio de email):**
```
SMTP_HOST=smtp.exemplo.com
SMTP_PORT=587
SMTP_USER=seu_email@exemplo.com
SMTP_PASS=sua_senha_smtp
SMTP_FROM="Poimen <noreply@poimen.com.br>"
```

⚠️ **IMPORTANTE:** Se você NÃO configurar SMTP, o sistema funciona normalmente! A senha temporária aparecerá nos **Logs do Render** quando alguém se cadastrar.

---

## 🧪 PASSO 3: Testar o Sistema em Produção

### Teste Frontend
1. Acesse: https://poimen.com.br
2. Verifique se a Landing Page carrega com tema escuro
3. Teste o cadastro com seu email
4. **Se SMTP não configurado:** Vá para os logs do Render e copie a senha temporária

### Teste Backend (Logs)
1. No Render Dashboard, clique no serviço backend
2. Clique em **"Logs"** no menu lateral
3. Quando alguém se cadastrar, você verá:
   ```
   ============================================================
   📧 EMAIL DE CADASTRO (Modo Desenvolvimento)
   ============================================================
   Para: usuario@exemplo.com
   Senha temporária: ABC123XY
   ============================================================
   ```

### Fluxo Completo de Teste
1. ✅ Acesse https://poimen.com.br
2. ✅ Cadastre-se com um email de teste
3. ✅ Copie a senha temporária (dos logs ou da tela)
4. ✅ Faça login em https://poimen.com.br/login
5. ✅ Configure suas chaves de API (Groq gratuito ou Gemini)
6. ✅ Acesse https://poimen.com.br/app
7. ✅ Faça upload de um documento PDF/DOCX
8. ✅ Realize uma análise bíblica
9. ✅ Verifique se o badge RAG aparece quando usar documentos permanentes

---

## 🔧 Troubleshooting

### Frontend não carrega
- Verifique se os arquivos estão na **raiz** de `public_html`, não em uma subpasta
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique se `index.html` está no `public_html`

### Backend não responde
- Verifique os logs no Render Dashboard
- Confirme que `FRONTEND_URL=https://poimen.com.br` está configurado
- Teste a URL: https://poimen-backend.onrender.com/health (deve retornar "OK")

### Erro de CORS
- Certifique-se que `FRONTEND_URL` no Render está correto
- O backend já está configurado para aceitar requests de `poimen.com.br`

### Senha não aparece
- **Modo Dev (sem SMTP):** A senha aparece nos Logs do Render
- **Modo Prod (com SMTP):** A senha é enviada por email
- Você pode mudar entre os modos configurando/removendo as variáveis SMTP

---

## 📊 Status de Deploy

- [x] Código no GitHub (commit: a99e605)
- [x] Build do frontend concluído
- [ ] Upload para cPanel
- [ ] Backend verificado no Render
- [ ] Teste completo em produção

---

## 🎯 URLs Finais

- **Frontend:** https://poimen.com.br
- **Backend:** https://poimen-backend.onrender.com
- **GitHub:** https://github.com/Piztos/poimen

---

## 💡 Próximos Passos (Opcional)

1. **Configurar SMTP** para envio automático de senhas por email
2. **Monitoramento:** Configurar alertas no Render para erros
3. **Analytics:** Adicionar Google Analytics se desejar
4. **Domínio personalizado:** Configurar SSL no cPanel se ainda não estiver ativo
5. **Backup:** Configurar backup automático do banco de dados SQLite

---

**Dúvidas?** Consulte a documentação ou os logs do sistema! 🚀
