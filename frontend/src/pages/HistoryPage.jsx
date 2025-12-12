import React, { useState, useEffect } from 'react'
import { Trash2, Eye, Download, Clock } from 'lucide-react'
import './HistoryPage.css'

function HistoryPage() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history')
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteItem = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) {
      return
    }

    try {
      const response = await fetch(`/api/history/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setHistory(history.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir item:', error)
    }
  }

  const viewItem = (item) => {
    // Implementar visualização detalhada
    console.log('Ver item:', item)
  }

  if (isLoading) {
    return (
      <div className="history-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando histórico...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Histórico de Análises</h1>
        <p className="history-subtitle">
          Suas análises bíblicas anteriores salvas
        </p>
      </div>

      {history.length === 0 ? (
        <div className="empty-state card">
          <Clock size={64} />
          <h2>Nenhuma análise salva ainda</h2>
          <p>As análises que você salvar aparecerão aqui</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item card">
              <div className="history-item-header">
                <div className="history-item-info">
                  <h3 className="history-item-title">
                    {item.biblicalText.substring(0, 100)}
                    {item.biblicalText.length > 100 ? '...' : ''}
                  </h3>
                  <div className="history-item-meta">
                    <Clock size={16} />
                    <span>{new Date(item.timestamp).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
                <div className="history-item-actions">
                  <button
                    onClick={() => viewItem(item)}
                    className="btn-icon"
                    title="Visualizar"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="btn-icon btn-danger-icon"
                    title="Excluir"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="history-item-content">
                <p className="history-item-text">{item.biblicalText}</p>
                <div className="history-item-ais">
                  <strong>IAs utilizadas:</strong>{' '}
                  {item.results.map(r => r.aiName).join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPage
