// Serviço para análise com IA usando backend (API keys do usuário)
import { API_ENDPOINTS } from '../config/api'

const AI_CONFIGS = {
  groq: {
    name: 'Groq Mixtral',
    icon: '⚡',
    description: 'Ultra rápido - 2-5 segundos',
    free: true
  },
  gemini: {
    name: 'Google Gemini Pro',
    icon: '🌟',
    description: 'Google AI, modelo estável',
    free: true
  }
}

/**
 * Analisa texto bíblico usando IA do backend
 */
export async function analyzeWithAI(aiId, prompt, biblicalText) {
  const config = AI_CONFIGS[aiId]
  
  if (!config) {
    throw new Error(`IA não suportada: ${aiId}`)
  }

  const token = localStorage.getItem('token')
  
  if (!token) {
    return {
      aiId,
      aiName: config.name,
      icon: config.icon,
      success: false,
      error: 'Faça login para usar o sistema',
      content: null
    }
  }

  try {
    const response = await fetch(API_ENDPOINTS.analysis, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        question: `${prompt}\n\nTexto bíblico: ${biblicalText}`,
        provider: aiId,
        useRAG: true
      })
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.needsConfiguration) {
        return {
          aiId,
          aiName: config.name,
          icon: config.icon,
          success: false,
          error: 'Configure suas chaves API antes de usar o sistema',
          needsApiKey: true,
          content: null
        }
      }
      
      throw new Error(data.error || 'Erro ao analisar')
    }

    console.log(data.usedRAG ? '✅ RAG ATIVO - Documentos permanentes usados na análise' : '⚠️ Nenhum documento permanente encontrado')

    return {
      aiId,
      aiName: config.name,
      icon: config.icon,
      success: true,
      error: null,
      content: data.answer,
      usedRAG: data.usedRAG
    }

  } catch (error) {
    console.error(`Erro ao chamar ${config.name}:`, error)
    
    return {
      aiId,
      aiName: config.name,
      icon: config.icon,
      success: false,
      error: error.message || `Erro ao conectar com ${config.name}`,
      content: null
    }
  }
}

export { AI_CONFIGS }
