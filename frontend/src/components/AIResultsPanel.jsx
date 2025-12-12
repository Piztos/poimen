import React, { useState } from 'react'
import { Copy, ExternalLink, Check, AlertCircle, Maximize2 } from 'lucide-react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { getAllAIConfigs } from '../services/aiService'
import './AIResultsPanel.css'

const AI_CONFIGS = getAllAIConfigs()

function AIResultsPanel({ results, onUpdateResult }) {
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [expandedIndex, setExpandedIndex] = useState(null)

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

  const formatContent = (content) => {
    if (!content) return ''
    const html = marked.parse(content)
    return DOMPurify.sanitize(html)
  }

  const openInNewWindow = (result) => {
    const newWindow = window.open('', '_blank', 'width=800,height=600')
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${result.aiName} - Análise Poimén</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              padding: 2rem;
              max-width: 900px;
              margin: 0 auto;
              background: #0f0f1e;
              color: #e0e0e0;
              line-height: 1.6;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #ffffff;
              margin-top: 1.5rem;
            }
            code {
              background: #1a1a2e;
              padding: 0.2rem 0.4rem;
              border-radius: 4px;
            }
            pre {
              background: #1a1a2e;
              padding: 1rem;
              border-radius: 8px;
              overflow-x: auto;
            }
            blockquote {
              border-left: 4px solid #533483;
              padding-left: 1rem;
              margin-left: 0;
              color: #a0a0a0;
            }
          </style>
        </head>
        <body>
          <h1>${result.icon} ${result.aiName}</h1>
          <hr>
          ${formatContent(result.content || result.error || 'Aguardando análise...')}
        </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  return (
    <div className="ai-results-panel">
      <h2 className="results-title">Resultados da Análise</h2>
      
      <div className="results-grid">
        {results.map((result, index) => (
          <div key={index} className={`result-card card ${result.needsManualInput ? 'manual-input' : ''}`}>
            <div className="result-header">
              <div className="result-title">
                <span className="result-icon">{result.icon}</span>
                <h3>{result.aiName}</h3>
                {result.usedRAG && (
                  <span className="rag-badge" title={`${result.ragContextLength} caracteres de documentos teológicos usados`}>
                    📚 RAG
                  </span>
                )}
              </div>
              <div className="result-actions">
                {result.webUrl && result.needsManualInput && (
                  <a 
                    href={result.webUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-icon"
                    title="Abrir IA em nova aba"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                {result.content && (
                  <>
                    <button
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      className="btn-icon"
                      title="Expandir"
                    >
                      <Maximize2 size={18} />
                    </button>
                    <button
                      onClick={() => copyToClipboard(result.content, index)}
                      className="btn-icon"
                      title="Copiar"
                    >
                      {copiedIndex === index ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="result-content">
              {result.needsApiKey ? (
                <div className="manual-input-instructions api-key-needed">
                  <AlertCircle size={24} />
                  <h4>API Key Necessária</h4>
                  <p>Esta IA é <strong>100% gratuita</strong> e automática, mas requer uma chave de API.</p>
                  <div className="api-key-steps">
                    <ol>
                      <li>Acesse: <a href={result.getKeyUrl} target="_blank" rel="noopener noreferrer">{result.getKeyUrl}</a></li>
                      <li>Crie uma conta gratuita (se necessário)</li>
                      <li>Gere sua API key</li>
                      <li>Cole abaixo e configure uma vez</li>
                    </ol>
                  </div>
                  <p className="api-note">💡 <strong>Após configurar, todas as análises serão automáticas!</strong></p>
                  <button
                    onClick={() => {
                      const key = prompt(`Cole sua API Key do ${result.aiName}:`)
                      if (key) {
                        localStorage.setItem(AI_CONFIGS[result.aiId]?.keyName, key.trim())
                        alert('✅ API Key salva! Clique em "Analisar" novamente.')
                      }
                    }}
                    className="btn btn-primary"
                  >
                    Configurar API Key
                  </button>
                </div>
              ) : result.success && result.content ? (
                <div 
                  className={`result-text ${expandedIndex === index ? 'expanded' : ''}`}
                  dangerouslySetInnerHTML={{ __html: formatContent(result.content) }}
                />
              ) : result.error ? (
                <div className="result-error">
                  <AlertCircle size={20} />
                  <p>{result.error}</p>
                </div>
              ) : (
                <div className="result-loading">
                  <div className="spinner"></div>
                  <p>Aguardando análise...</p>
                </div>
              )}
            </div>

            {result.content && expandedIndex !== index && (
              <button
                onClick={() => openInNewWindow(result)}
                className="btn btn-secondary btn-sm"
              >
                <ExternalLink size={16} />
                Visualizar Completo
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ManualInputField({ resultIndex, aiName, onContentSubmit }) {
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    if (content.trim()) {
      onContentSubmit(content.trim())
    }
  }

  return (
    <div className="manual-input-field">
      <label htmlFor={`manual-input-${resultIndex}`}>
        Cole aqui a resposta do {aiName}:
      </label>
      <textarea
        id={`manual-input-${resultIndex}`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`Cole aqui a resposta completa do ${aiName}...`}
        rows={8}
      />
      <button
        onClick={handleSubmit}
        disabled={!content.trim()}
        className="btn btn-primary btn-sm"
      >
        <Check size={16} />
        Confirmar Resposta
      </button>
    </div>
  )
}

export default AIResultsPanel
