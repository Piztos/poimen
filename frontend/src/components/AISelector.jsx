import React from 'react'
import { Sparkles, Check } from 'lucide-react'
import './AISelector.css'

const availableAIs = [
  {
    id: 'gemini',
    name: 'Google Gemini 2.5',
    description: '🌟 GRÁTIS - Modelo estável Google',
    icon: '🌟',
    color: '#4285f4'
  },
  {
    id: 'groq',
    name: 'Groq Llama 3.3',
    description: '⚡ GRÁTIS - Ultra rápido (2-5s)',
    icon: '⚡',
    color: '#f55036'
  },
  {
    id: 'mistral',
    name: 'Mistral AI Small',
    description: '🌪️ GRÁTIS - Europeu, privado',
    icon: '🌪️',
    color: '#ff7000'
  }
]

function AISelector({ selectedAIs, onChange, disabled }) {
  const toggleAI = (aiId) => {
    if (selectedAIs.includes(aiId)) {
      onChange(selectedAIs.filter(id => id !== aiId))
    } else {
      onChange([...selectedAIs, aiId])
    }
  }

  const selectAll = () => {
    onChange(availableAIs.map(ai => ai.id))
  }

  const clearAll = () => {
    onChange([])
  }

  return (
    <div className="ai-selector-container">
      <div className="selector-header">
        <div className="selector-title">
          <Sparkles size={20} />
          <span>Selecione as IAs para Análise</span>
        </div>
        <div className="selector-actions">
          <button 
            onClick={selectAll}
            disabled={disabled}
            className="btn-text"
          >
            Selecionar Todas
          </button>
          <button 
            onClick={clearAll}
            disabled={disabled}
            className="btn-text"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="ai-grid">
        {availableAIs.map(ai => {
          const isSelected = selectedAIs.includes(ai.id)
          
          return (
            <button
              key={ai.id}
              onClick={() => toggleAI(ai.id)}
              disabled={disabled}
              className={`ai-card ${isSelected ? 'selected' : ''}`}
              style={{
                '--ai-color': ai.color
              }}
            >
              <div className="ai-card-header">
                <span className="ai-icon">{ai.icon}</span>
                {isSelected && (
                  <div className="selected-badge">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <h3 className="ai-name">{ai.name}</h3>
              <p className="ai-description">{ai.description}</p>
            </button>
          )
        })}
      </div>

      {selectedAIs.length > 0 && (
        <div className="selection-info">
          <p>
            <strong>{selectedAIs.length}</strong> IA{selectedAIs.length > 1 ? 's' : ''} selecionada{selectedAIs.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}

export default AISelector
