import React, { useState, useEffect } from 'react'
import { Key, Check, X, ExternalLink, Info } from 'lucide-react'
import { getAllAIConfigs, saveApiKey, removeApiKey, hasApiKey } from '../services/aiService'
import './SettingsPage.css'

function SettingsPage() {
  const [apiKeys, setApiKeys] = useState({})
  const [showKey, setShowKey] = useState({})
  const [savedMessage, setSavedMessage] = useState(null)

  const aiConfigs = getAllAIConfigs()

  useEffect(() => {
    // Carrega status das API keys ao montar
    const keys = {}
    Object.keys(aiConfigs).forEach(aiId => {
      keys[aiId] = hasApiKey(aiId)
    })
    setApiKeys(keys)
  }, [])

  const handleSaveKey = (aiId) => {
    const inputElement = document.getElementById(`key-${aiId}`)
    const key = inputElement?.value?.trim()

    if (key) {
      saveApiKey(aiId, key)
      setApiKeys({ ...apiKeys, [aiId]: true })
      inputElement.value = ''
      setSavedMessage(`✅ API Key do ${aiConfigs[aiId].name} salva com sucesso!`)
      setTimeout(() => setSavedMessage(null), 3000)
    }
  }

  const handleRemoveKey = (aiId) => {
    if (confirm(`Deseja remover a API Key do ${aiConfigs[aiId].name}?`)) {
      removeApiKey(aiId)
      setApiKeys({ ...apiKeys, [aiId]: false })
      setSavedMessage(`🗑️ API Key do ${aiConfigs[aiId].name} removida`)
      setTimeout(() => setSavedMessage(null), 3000)
    }
  }

  const toggleShowKey = (aiId) => {
    setShowKey({ ...showKey, [aiId]: !showKey[aiId] })
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>
            <Key size={32} />
            Configuração de API Keys
          </h1>
          <p className="settings-description">
            Configure suas chaves de API gratuitas para análises 100% automáticas.
            Cada IA requer uma chave, mas todas são <strong>totalmente gratuitas</strong>!
          </p>
        </div>

        {savedMessage && (
          <div className="save-message">
            {savedMessage}
          </div>
        )}

        <div className="api-cards-grid">
          {Object.entries(aiConfigs).map(([aiId, config]) => {
            const isConfigured = apiKeys[aiId]

            return (
              <div key={aiId} className={`api-card card ${isConfigured ? 'configured' : ''}`}>
                <div className="api-card-header">
                  <div className="api-card-title">
                    <span className="api-icon">{config.icon}</span>
                    <h3>{config.name}</h3>
                  </div>
                  {isConfigured && (
                    <span className="status-badge configured">
                      <Check size={16} />
                      Configurada
                    </span>
                  )}
                </div>

                <div className="api-card-info">
                  <div className="info-row">
                    <Info size={16} />
                    <span>100% Gratuito</span>
                  </div>
                  <a 
                    href={config.getKeyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="get-key-link"
                  >
                    <ExternalLink size={14} />
                    Obter API Key Gratuita
                  </a>
                </div>

                {isConfigured ? (
                  <div className="configured-actions">
                    <p className="configured-message">
                      ✅ Esta IA está pronta para uso automático!
                    </p>
                    <button
                      onClick={() => handleRemoveKey(aiId)}
                      className="btn btn-danger btn-sm"
                    >
                      <X size={16} />
                      Remover Key
                    </button>
                  </div>
                ) : (
                  <div className="key-input-group">
                    <label htmlFor={`key-${aiId}`}>Cole sua API Key:</label>
                    <div className="key-input-wrapper">
                      <input
                        id={`key-${aiId}`}
                        type={showKey[aiId] ? 'text' : 'password'}
                        placeholder="sk-..."
                        className="key-input"
                      />
                      <button
                        onClick={() => toggleShowKey(aiId)}
                        className="btn-icon"
                        title={showKey[aiId] ? 'Ocultar' : 'Mostrar'}
                      >
                        {showKey[aiId] ? '🙈' : '👁️'}
                      </button>
                    </div>
                    <button
                      onClick={() => handleSaveKey(aiId)}
                      className="btn btn-primary btn-sm"
                    >
                      <Check size={16} />
                      Salvar Key
                    </button>
                  </div>
                )}

                <details className="api-instructions">
                  <summary>Como obter gratuitamente?</summary>
                  <ol>
                    <li>Clique em "Obter API Key Gratuita" acima</li>
                    <li>Crie uma conta gratuita (email + senha)</li>
                    <li>Vá em "API Keys" ou "Credentials"</li>
                    <li>Clique em "Create API Key"</li>
                    <li>Copie a key e cole aqui</li>
                  </ol>
                  <p className="api-note">
                    💡 <strong>Dica:</strong> As keys ficam salvas no seu navegador. 
                    Configure uma vez e use para sempre!
                  </p>
                </details>
              </div>
            )
          })}
        </div>

        <div className="settings-footer card">
          <h3>❓ Por que preciso de API Keys?</h3>
          <p>
            As API Keys permitem que o Poimén faça requisições <strong>automáticas</strong> 
            às IAs em seu nome. Sem elas, você precisaria copiar/colar manualmente as 
            respostas de cada IA.
          </p>
          <p>
            <strong>Todas as 5 IAs oferecidas são 100% gratuitas</strong>, com limites 
            generosos que permitem centenas ou milhares de análises por mês.
          </p>
          <div className="free-tier-info">
            <h4>📊 Limites Gratuitos (Dezembro 2025):</h4>
            <ul>
              <li><strong>Google Gemini 1.5:</strong> 1500 req/dia - Flash é o mais rápido</li>
              <li><strong>Groq:</strong> 30 req/min - Velocidade extrema com Llama 3.3</li>
              <li><strong>Mistral AI:</strong> 1000 req/mês - Europeu e open source</li>
              <li><strong>OpenRouter:</strong> Múltiplos modelos gratuitos simultaneamente</li>
              <li><strong>Perplexity:</strong> Com busca web em tempo real integrada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
