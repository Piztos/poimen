# 🚀 Início Rápido - Poimén

Este guia vai te ajudar a começar com o Poimén em **menos de 5 minutos**.

## ⚡ Instalação Express (Windows)

```powershell
# 1. Certifique-se que tem Node.js instalado
node --version
# Deve mostrar v18.0.0 ou superior

# 2. Entre na pasta do projeto
cd "c:\pav\Fluxo de Atendimento\Pessoal\python\novos_programas\Poimen"

# 3. Instale TUDO de uma vez
npm run install:all

# 4. Inicie o sistema
npm run dev
```

Pronto! O sistema abrirá automaticamente em `http://localhost:3000` 🎉

## 📱 Primeiro Uso

### 1. Análise Básica

1. Clique em **"Análise"** no menu
2. Cole um texto bíblico (ex: João 3:16)
3. Selecione pelo menos uma IA
4. Clique em **"Analisar com IAs Selecionadas"**

### 2. IAs Disponíveis

#### 🔮 Google Gemini (API Gratuita)
- **Recomendado**: Use API key gratuita
- Pegue sua chave em: [Google AI Studio](https://makersuite.google.com/app/apikey)
- Cole nas configurações do Poimén

#### 🤖 ChatGPT, 🧠 DeepSeek, 🪁 Copilot
- **Interface Web Gratuita**
- Sistema abre automaticamente
- Copie e cole manualmente

### 3. Exportar Resultados

Após análise:
1. Clique em **"Exportar Resultados"**
2. Escolha formato:
   - **PDF** - Para impressão
   - **DOCX** - Para editar no Word
   - **Markdown** - Para desenvolvedores
   - **TXT** - Simples e universal
   - **Google Docs** - Para nuvem

## 🎯 Fluxo Completo (5 passos)

```
1. Texto Bíblico → 2. Selecionar IAs → 3. Analisar → 4. Revisar → 5. Exportar
```

## 💡 Dicas Rápidas

### ✅ Melhores Práticas

- **Use NVI**: A Bíblia NVI é recomendada
- **Seja específico**: Análise de perícopes específicas funciona melhor
- **Multiple IAs**: Compare respostas de diferentes IAs
- **Salve no histórico**: Não perca suas análises

### ⚠️ Evite

- Textos muito longos (divida em perícopes)
- Análises sem contexto
- Não salvar resultados importantes

## 🔧 Comandos Úteis

```powershell
# Iniciar apenas frontend
npm run dev:frontend

# Iniciar apenas backend  
npm run dev:backend

# Build para produção
npm run build

# Limpar e reinstalar
Remove-Item -Recurse -Force node_modules
npm run install:all
```

## 📚 Recursos

- 📖 [README completo](README.md)
- 🔧 [Guia de instalação](INSTALL.md)
- 🚀 [Guia de deploy](DEPLOY.md)
- 🤝 [Como contribuir](CONTRIBUTING.md)

## ❓ Problemas Comuns

### Porta 3000 ou 5000 em uso

```powershell
# Ver processos nas portas
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Matar processo
taskkill /PID [número_do_pid] /F
```

### Node não reconhecido

1. Reinstale Node.js de [nodejs.org](https://nodejs.org)
2. Reinicie PowerShell
3. Tente novamente

### Erro ao instalar dependências

```powershell
# Limpe cache do npm
npm cache clean --force

# Reinstale
npm install
```

## 🎓 Tutorial em Vídeo

*(Planejado para futuro)*

## 💬 Precisa de Ajuda?

- 📧 Email: suporte@poimen.app
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/poimen/issues)
- 💡 Discussões: [GitHub Discussions](https://github.com/seu-usuario/poimen/discussions)

---

**Comece agora sua jornada de estudos bíblicos profundos!** 📖✨

*Poimén - Para a glória de Deus*
