import React, { useState, useEffect } from 'react'
import { Upload, FileText, Trash2, AlertCircle, CheckCircle, Clock, Bookmark } from 'lucide-react'
import './DocumentsPage.css'
import { API_ENDPOINTS } from '../config/api'
import { authFetch } from '../utils/authFetch'

function DocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [isPermanent, setIsPermanent] = useState(false)
  const [storageStats, setStorageStats] = useState(null)
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.documents)
      const data = await response.json()
      
      if (data.success) {
        setDocuments(data.documents)
        setStorageStats(data.storage)
      }
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadMultipleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadMultipleFiles(Array.from(e.target.files))
    }
  }

  const uploadMultipleFiles = async (files) => {
    const totalFiles = files.length
    setUploadProgress({ current: 0, total: totalFiles })
    setUploading(true)
    setMessage(null)

    const results = {
      success: [],
      failed: []
    }

    for (let i = 0; i < files.length; i++) {
      setUploadProgress({ current: i + 1, total: totalFiles })
      
      try {
        const result = await uploadFile(files[i])
        if (result.success) {
          results.success.push({ name: files[i].name, chunks: result.chunks })
        } else {
          results.failed.push({ name: files[i].name, error: result.error })
        }
      } catch (error) {
        results.failed.push({ name: files[i].name, error: error.message })
      }
    }

    setUploading(false)
    setUploadProgress({ current: 0, total: 0 })

    // Mostrar resumo
    if (results.success.length > 0 && results.failed.length === 0) {
      const totalChunks = results.success.reduce((sum, r) => sum + r.chunks, 0)
      setMessage({ 
        type: 'success', 
        text: `✅ ${results.success.length} arquivo(s) processado(s) com sucesso! ${totalChunks} chunks indexados.` 
      })
    } else if (results.failed.length > 0 && results.success.length === 0) {
      setMessage({ 
        type: 'error', 
        text: `❌ Todos os ${results.failed.length} arquivo(s) falharam. Verifique se são PDFs com texto selecionável.` 
      })
    } else {
      setMessage({ 
        type: 'warning', 
        text: `⚠️ ${results.success.length} sucesso, ${results.failed.length} falharam. Arquivos com falha: ${results.failed.map(f => f.name).join(', ')}` 
      })
    }

    await loadDocuments()
  }

  const uploadFile = async (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Tipo de arquivo não suportado' }
    }

    // Valida PDF para permanentes
    if (isPermanent && file.type !== 'application/pdf') {
      return { success: false, error: 'Documentos permanentes devem ser PDF' }
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'Arquivo maior que 10MB' }
    }

    try {
      const formData = new FormData()
      formData.append('document', file)
      formData.append('isPermanent', isPermanent)

      const response = await authFetch(API_ENDPOINTS.documentsUpload, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        return { success: true, chunks: data.data.chunks, filename: data.data.filename }
      } else {
        return { success: false, error: data.error || 'Erro ao processar' }
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      return { success: false, error: 'Erro de conexão' }
    }
  }

  const handleDelete = async (docId, filename) => {
    if (!window.confirm(`Deseja realmente deletar "${filename}"?`)) {
      return
    }

    try {
      const response = await authFetch(API_ENDPOINTS.documentById(docId), {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Documento deletado com sucesso' })
        await loadDocuments()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao deletar documento' })
      }
    } catch (error) {
      console.error('Erro ao deletar:', error)
      setMessage({ type: 'error', text: 'Erro ao deletar documento' })
    }
  }

  const handleClearTemporary = async () => {
    const tempCount = documents.filter(d => !d.isPermanent).length
    
    if (tempCount === 0) {
      setMessage({ type: 'error', text: 'Não há documentos temporários para limpar' })
      return
    }

    if (!window.confirm(`Deseja realmente deletar todos os ${tempCount} documentos temporários?`)) {
      return
    }

    try {
      const response = await authFetch(API_ENDPOINTS.documentsClearTemp, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        await loadDocuments()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao limpar documentos' })
      }
    } catch (error) {
      console.error('Erro ao limpar:', error)
      setMessage({ type: 'error', text: 'Erro ao limpar documentos temporários' })
    }
  }

  const getTimeSince = (dateString) => {
    if (!dateString) return null
    const now = new Date()
    const past = new Date(dateString)
    const diffMs = now - past
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffDays > 0) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`
    if (diffHours > 0) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`
    if (diffMins > 0) return `há ${diffMins} min`
    return 'agora'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR')
  }

  return (
    <div className="documents-page">
      <div className="documents-header">
        <h1>📚 Base de Conhecimento</h1>
        <p>Adicione documentos teológicos para enriquecer as análises das IAs</p>
      </div>

      {uploading && uploadProgress.total > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-800 font-medium">
              Processando arquivo {uploadProgress.current} de {uploadProgress.total}...
            </span>
            <span className="text-blue-600">
              {Math.round((uploadProgress.current / uploadProgress.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {message && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {storageStats && storageStats.isNearLimit && isPermanent && (
        <div className="storage-warning">
          <AlertCircle size={20} />
          <div>
            <strong>⚠️ Armazenamento Permanente Próximo do Limite</strong>
            <p>
              Você está usando {storageStats.permanentSizeMB}MB de 150MB ({storageStats.usagePercent}%). 
              Considere remover documentos permanentes antigos com baixa relevância antes de adicionar novos.
            </p>
          </div>
        </div>
      )}

      <div className="upload-section">
        <div className="session-type-selector">
          <h3>Tipo de Sessão</h3>
          <div className="session-options">
            <div 
              className={`session-option ${!isPermanent ? 'active' : ''}`}
              onClick={() => setIsPermanent(false)}
            >
              <div className="option-header">
                <Clock size={24} />
                <strong>Temporária</strong>
              </div>
              <p className="option-description">
                Documentos são removidos automaticamente ao fechar o navegador. 
                Ideal para estudos pontuais e séries específicas.
              </p>
              <div className="option-examples">
                <span>📖 Comentários para série</span>
                <span>📝 Material de estudo pontual</span>
              </div>
            </div>

            <div 
              className={`session-option ${isPermanent ? 'active' : ''}`}
              onClick={() => setIsPermanent(true)}
            >
              <div className="option-header">
                <Bookmark size={24} />
                <strong>Permanente</strong>
              </div>
              <p className="option-description">
                Base teológica SEMPRE consultada em todas as análises. 
                Fundamento essencial do sistema Poimén. <strong>(Apenas PDF)</strong>
              </p>
              <div className="option-examples">
                <span>📜 Confissões</span>
                <span>📚 Catecismos</span>
                <span>⚖️ Hermenêutica</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload size={48} />
          <h3>Arraste documentos aqui</h3>
          <p>ou clique para selecionar</p>
          <p className="file-types">
            {isPermanent ? 'PDF (máx. 10MB cada) - Upload múltiplo' : 'PDF, DOCX, TXT (máx. 10MB cada) - Upload múltiplo'}
          </p>
          
          <input
            type="file"
            accept={isPermanent ? '.pdf' : '.pdf,.docx,.txt'}
            onChange={handleFileInput}
            disabled={uploading}
            multiple
            style={{ display: 'none' }}
            id="file-input"
          />
          
          <label htmlFor="file-input" className="upload-button">
            {uploading ? 'Processando...' : 'Selecionar Arquivo'}
          </label>
        </div>
      </div>

      <div className="documents-list">
        <div className="list-header">
          <h2>Documentos ({documents.length})</h2>
          {documents.filter(d => !d.isPermanent).length > 0 && (
            <button className="btn-clear-temp" onClick={handleClearTemporary}>
              <Trash2 size={16} />
              Limpar Temporários ({documents.filter(d => !d.isPermanent).length})
            </button>
          )}
        </div>
        
        {documents.length === 0 ? (
          <div className="empty-state">
            <FileText size={64} />
            <p>Nenhum documento adicionado ainda</p>
            <p className="hint">Adicione documentos teológicos para melhorar as análises</p>
          </div>
        ) : (
          <div className="documents-grid">
            {documents.map((doc) => {
              const timeSince = getTimeSince(doc.lastUsed)
              
              return (
                <div key={doc.docId} className="document-card">
                  <div className="document-header-card">
                    <div className="document-icon">
                      <FileText size={32} />
                    </div>
                    <span className={`session-badge ${doc.isPermanent ? 'permanent' : 'temporary'}`}>
                      {doc.isPermanent ? (
                        <>
                          <Bookmark size={12} />
                          Permanente
                        </>
                      ) : (
                        <>
                          <Clock size={12} />
                          Temporária
                        </>
                      )}
                    </span>
                  </div>
                  <div className="document-info">
                    <h3>{doc.filename}</h3>
                    <div className="document-meta">
                      <span>{doc.chunks} chunks</span>
                      <span>•</span>
                      <span>{formatDate(doc.uploadDate)}</span>
                    </div>
                    {doc.isPermanent ? (
                      doc.relevanceCount > 0 && (
                        <div className="relevance-info">
                          ⭐ Relevante em {doc.relevanceCount} análise{doc.relevanceCount > 1 ? 's' : ''}
                        </div>
                      )
                    ) : (
                      timeSince && (
                        <div className="usage-info">
                          ✅ Usado {timeSince} ({doc.usageCount}x)
                        </div>
                      )
                    )}
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(doc.docId, doc.filename)}
                    title="Deletar documento"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="info-section">
        <h3>ℹ️ Como funciona</h3>
        <ul>
          <li>📤 Faça upload de documentos teológicos (comentários, estudos, sermões)</li>
          <li>🤖 O sistema processa e indexa automaticamente o conteúdo</li>
          <li>🔍 Durante as análises, trechos relevantes são automaticamente incluídos</li>
          <li>✨ As IAs usam seu conhecimento + os documentos para respostas mais precisas</li>
        </ul>
      </div>
    </div>
  )
}

export default DocumentsPage
