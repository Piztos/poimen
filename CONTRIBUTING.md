# Contribuindo para o Poimén

Obrigado por considerar contribuir para o Poimén! 🙏

## 📋 Código de Conduta

Este projeto segue um código de conduta baseado em valores cristãos reformados:

- Trate todos com respeito e dignidade
- Seja paciente e gentil em discussões
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Glorifique a Deus em tudo

## 🤝 Como Contribuir

### Reportar Bugs

1. Verifique se o bug já foi reportado nas [Issues](https://github.com/seu-usuario/poimen/issues)
2. Se não, crie uma nova issue com:
   - Título claro e descritivo
   - Passos para reproduzir o bug
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Ambiente (SO, navegador, versão)

### Sugerir Funcionalidades

1. Abra uma issue com tag `enhancement`
2. Descreva claramente:
   - O problema que a funcionalidade resolve
   - Como deveria funcionar
   - Exemplos de uso
   - Alternativas consideradas

### Pull Requests

#### Processo

1. **Fork** o repositório
2. **Clone** seu fork:
   ```bash
   git clone https://github.com/seu-usuario/poimen.git
   ```
3. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/MinhaNovaFuncionalidade
   ```
4. **Faça suas alterações**
5. **Commit** com mensagens claras:
   ```bash
   git commit -m "Adiciona análise com IA XYZ"
   ```
6. **Push** para seu fork:
   ```bash
   git push origin feature/MinhaNovaFuncionalidade
   ```
7. **Abra um Pull Request**

#### Diretrizes de Código

**JavaScript/React**:
```javascript
// ✅ Bom
function analyzeText(text) {
  if (!text) return null
  return processAnalysis(text)
}

// ❌ Evite
function analyze(t){return t?processAnalysis(t):null}
```

**Naming Conventions**:
- Componentes: `PascalCase` (ex: `AISelector`)
- Funções: `camelCase` (ex: `analyzeWithAI`)
- Constantes: `UPPER_SNAKE_CASE` (ex: `POIMEN_AGENT_PROMPT`)
- Arquivos: `PascalCase.jsx` para componentes, `camelCase.js` para utils

**CSS**:
```css
/* ✅ Bom - Use variáveis CSS */
.card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius-lg);
}

/* ❌ Evite - Valores hardcoded */
.card {
  background-color: #1a1a2e;
  border-radius: 12px;
}
```

#### Checklist do PR

- [ ] Código segue as diretrizes do projeto
- [ ] Comentários adicionados em código complexo
- [ ] Documentação atualizada (README, etc)
- [ ] Testes passam (quando aplicável)
- [ ] Sem warnings de console
- [ ] Responsivo em mobile
- [ ] Acessibilidade considerada

## 🎨 Design e UI

### Princípios

1. **Simplicidade**: Interface limpa e intuitiva
2. **Responsividade**: Funciona em todos os dispositivos
3. **Acessibilidade**: WCAG 2.1 Level AA
4. **Performance**: Carregamento rápido
5. **Consistência**: Padrões visuais uniformes

### Cores

Use as variáveis CSS definidas em `frontend/src/styles/index.css`:

```css
--primary-color: #1a1a2e;
--secondary-color: #16213e;
--accent-color: #0f3460;
--highlight-color: #533483;
```

## 📚 Teologia e Conteúdo

### Princípios Teológicos

O Poimén é baseado na **teologia reformada histórica**. Contribuições devem:

1. Respeitar a autoridade das Escrituras
2. Alinhar-se com as Confissões Reformadas
3. Citar fontes teológicas confiáveis
4. Evitar especulações não fundamentadas

### Autores de Referência

Priorizamos autores reformados como:
- João Calvino, Charles Spurgeon, John Piper
- Timothy Keller, D.A. Carson, J.I. Packer
- E outros listados no README.md

### Adicionando Conteúdo Teológico

Ao modificar o agente Poimén:

1. Base em fontes reformadas confiáveis
2. Cite referências quando aplicável
3. Mantenha linguagem pastoral e clara
4. Evite jargões desnecessários
5. Priorize aplicação prática

## 🧪 Testes (Futuro)

Planejamos adicionar testes. Contribuições nessa área são bem-vindas!

```javascript
// Exemplo futuro
describe('AIService', () => {
  it('should analyze text with Gemini', async () => {
    const result = await analyzeWithAI('gemini', prompt, text)
    expect(result.success).toBe(true)
  })
})
```

## 📝 Documentação

### README

- Mantenha seções organizadas
- Use linguagem clara e objetiva
- Adicione exemplos práticos
- Atualize índice se necessário

### Comentários no Código

```javascript
/**
 * Analisa texto bíblico usando IA específica
 * @param {string} aiId - ID da IA (gemini, chatgpt, etc)
 * @param {string} prompt - Prompt completo do agente
 * @param {string} text - Texto bíblico para análise
 * @returns {Promise<Object>} Resultado da análise
 */
```

## 🏷️ Versionamento

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Novas funcionalidades (compatíveis)
- **PATCH**: Correções de bugs

Exemplo: `1.2.3`
- `1`: Major version
- `2`: Minor version
- `3`: Patch version

## 📧 Comunicação

### Canais

- **Issues**: Bugs e sugestões
- **Discussions**: Perguntas e ideias
- **Email**: suporte@poimen.app (questões privadas)

### Etiqueta

- Seja respeitoso e profissional
- Use títulos descritivos
- Forneça contexto suficiente
- Seja paciente aguardando respostas
- Agradeça contribuições de outros

## 🎯 Áreas Prioritárias

Contribuições são especialmente bem-vindas em:

1. **Novas IAs gratuitas** - Integração de mais modelos
2. **Testes automatizados** - Cobertura de testes
3. **Acessibilidade** - Melhorias WCAG
4. **Performance** - Otimizações
5. **Documentação** - Guias e tutoriais
6. **Traduções** - Internacionalização (i18n)
7. **Templates de sermão** - Exemplos práticos

## ❤️ Reconhecimento

Todos os contribuidores serão reconhecidos:

- No README.md (seção Contributors)
- No CHANGELOG.md
- Nos release notes

## 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a [Licença MIT](LICENSE).

---

**Soli Deo Gloria** - Para a glória de Deus somente

Obrigado por ajudar a construir o Poimén! 🙏📖
