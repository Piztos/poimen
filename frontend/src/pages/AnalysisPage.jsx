import React, { useState } from 'react'
import { Sparkles, Download, Save, X } from 'lucide-react'
import AISelector from '../components/AISelector'
import TextInput from '../components/TextInput'
import AIResultsPanel from '../components/AIResultsPanel'
import ExportModal from '../components/ExportModal'
import { analyzeWithAI } from '../services/aiService'
import POIMEN_AGENT_PROMPT from '../services/poimenAgent'
import './AnalysisPage.css'

function AnalysisPage() {
  const [biblicalText, setBiblicalText] = useState('')
  const [userGuidance, setUserGuidance] = useState('')
  const [selectedAIs, setSelectedAIs] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState([])
  const [showExportModal, setShowExportModal] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!biblicalText.trim()) {
      setError('Por favor, insira o texto bíblico para análise.')
      return
    }

    if (selectedAIs.length === 0) {
      setError('Por favor, selecione pelo menos uma IA.')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResults([])

    try {
      let fullPrompt = `${POIMEN_AGENT_PROMPT}\n\n---\n\nTEXTO BÍBLICO PARA ANÁLISE:\n\n${biblicalText}`
      
      if (userGuidance.trim()) {
        fullPrompt += `\n\n---\n\n🎯 DIRECIONAMENTO DO USUÁRIO:\n\n${userGuidance}\n\n⚠️ IMPORTANTE: Considere atentamente as observações, estrutura e pontos indicados acima. Sua análise deve interagir com essas informações, validando, complementando ou expandindo os pontos mencionados.`
      }
      
      fullPrompt += `\n\n---\n\nPor favor, realize a análise completa seguindo todas as instruções do agente Poimén.`

      // Processamento PARALELO - todas as IAs começam ao mesmo tempo
      // Gemini continua tentando enquanto outras IAs já retornam
      const analysisPromises = selectedAIs.map(aiId => 
        analyzeWithAI(aiId, fullPrompt, biblicalText)
          .then(result => {
            if (result) {
              setResults(prev => {
                // Evita duplicatas
                if (prev.some(r => r.aiId === result.aiId)) return prev
                return [...prev, result]
              })
            }
            return result
          })
          .catch(err => {
            console.error(`Erro na análise com ${aiId}:`, err)
            return null
          })
      )

      // Aguarda TODAS as análises completarem (incluindo Gemini com retries)
      await Promise.all(analysisPromises)
    } catch (err) {
      setError('Erro ao realizar análise: ' + err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveHistory = async () => {
    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          biblicalText,
          results,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        alert('Análise salva no histórico com sucesso!')
      }
    } catch (err) {
      console.error('Erro ao salvar histórico:', err)
    }
  }

  const handleClearResults = () => {
    setResults([])
    setBiblicalText('')
    setUserGuidance('')
    setSelectedAIs([])
    setError(null)
  }

  return (
    <div className="analysis-page">
      <div className="analysis-header">
        <h1>Análise Bíblica com IA</h1>
        <p className="analysis-subtitle">
          Análise profunda baseada na teologia reformada com múltiplas IAs gratuitas
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)} className="alert-close">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="analysis-content">
        <div className="input-section card">
          <TextInput 
            value={biblicalText}
            onChange={setBiblicalText}
            userGuidance={userGuidance}
            onGuidanceChange={setUserGuidance}
            disabled={isAnalyzing}
          />
          
          <AISelector 
            selectedAIs={selectedAIs}
            onChange={setSelectedAIs}
            disabled={isAnalyzing}
          />

          <div className="action-buttons">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !biblicalText.trim() || selectedAIs.length === 0}
              className="btn btn-primary btn-analyze"
            >
              <Sparkles size={20} />
              {isAnalyzing ? 'Analisando...' : 'Analisar com IAs Selecionadas'}
            </button>

            {results.length > 0 && (
              <>
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="btn btn-success"
                >
                  <Download size={20} />
                  Exportar Resultados
                </button>

                <button 
                  onClick={handleSaveHistory}
                  className="btn btn-secondary"
                >
                  <Save size={20} />
                  Salvar no Histórico
                </button>

                <button 
                  onClick={handleClearResults}
                  className="btn btn-danger"
                >
                  <X size={20} />
                  Limpar
                </button>
              </>
            )}
          </div>
        </div>

        {isAnalyzing && (
          <div className="loading-section">
            <div className="spinner"></div>
            <p>Aguardando análise das IAs selecionadas...</p>
          </div>
        )}

        {results.length > 0 && (
          <AIResultsPanel 
            results={results} 
            onUpdateResult={(index, updatedResult) => {
              const newResults = [...results]
              newResults[index] = { ...newResults[index], ...updatedResult }
              setResults(newResults)
            }}
          />
        )}
      </div>

      {showExportModal && (
        <ExportModal 
          results={results}
          biblicalText={biblicalText}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  )
}

export default AnalysisPage
