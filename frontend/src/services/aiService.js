// Serviço para integração com múltiplas IAs gratuitas - TODAS AUTOMÁTICAS

const AI_CONFIGS = {
  gemini: {
    name: 'Google Gemini 2.5 Flash',
    type: 'api',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    model: 'gemini-2.5-flash',
    keyName: 'gemini_api_key',
    getKeyUrl: 'https://aistudio.google.com/apikey',
    icon: '🌟',
    free: true,
    description: 'Google, grátis, modelo estável'
  },
  groq: {
    name: 'Groq Llama 3.3',
    type: 'api',
    apiEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    keyName: 'groq_api_key',
    getKeyUrl: 'https://console.groq.com/keys',
    icon: '⚡',
    free: true,
    description: 'Ultra rápido - 2-5 segundos'
  },
  mistral: {
    name: 'Mistral AI Small',
    type: 'api',
    apiEndpoint: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-small-latest',
    keyName: 'mistral_api_key',
    getKeyUrl: 'https://console.mistral.ai/api-keys/',
    icon: '🌪️',
    free: true,
    description: 'Europeu, privacidade garantida'
  }
}

/**
 * Busca contexto relevante nos documentos RAG
 */
async function searchRAGContext(biblicalText) {
  try {
    const response = await fetch(API_ENDPOINTS.documentsSearch, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: biblicalText, topK: 3 })
    })
    
    const data = await response.json()
    
    if (data.success && data.results.length > 0) {
      return data.results.map((result, idx) => 
        `[Documento ${idx + 1} - ${result.metadata.filename}]\n${result.text}`
      ).join('\n\n---\n\n')
    }
    
    return null
  } catch (error) {
    console.log('Nenhum documento RAG disponível')
    return null
  }
}

/**
 * Analisa texto bíblico usando IA específica - TOTALMENTE AUTOMÁTICO
 * @param {string} aiId - ID da IA (gemini, groq, huggingface, cohere, deepseek)
 * @param {string} prompt - Prompt completo com instrução do agente Poimén
 * @param {string} biblicalText - Texto bíblico
 * @returns {Promise<Object>} Resultado da análise
 */
export async function analyzeWithAI(aiId, prompt, biblicalText) {
  const config = AI_CONFIGS[aiId]
  
  if (!config) {
    throw new Error(`IA não suportada: ${aiId}`)
  }

  // Verifica se tem API key
  const apiKey = localStorage.getItem(config.keyName)
  
  if (!apiKey) {
    return {
      aiId,
      aiName: config.name,
      icon: config.icon,
      success: false,
      error: `API Key não configurada. Obtenha gratuitamente em: ${config.getKeyUrl}`,
      needsApiKey: true,
      getKeyUrl: config.getKeyUrl,
      content: null
    }
  }

  try {
    // Busca contexto RAG
    const ragContext = await searchRAGContext(biblicalText)
    
    // Log detalhado para debug
    if (ragContext) {
      console.log(`✅ RAG ATIVO para ${config.name}: ${ragContext.length} caracteres de contexto teológico encontrados`)
      console.log('📚 Prévia do contexto:', ragContext.substring(0, 200) + '...')
    } else {
      console.log(`⚠️ RAG para ${config.name}: Nenhum documento permanente relevante encontrado`)
    }
    
    // Adiciona contexto RAG ao prompt se disponível
    let enhancedPrompt = prompt
    let usedRAG = false
    if (ragContext) {
      enhancedPrompt = `${prompt}\n\n📚 CONTEXTO DE DOCUMENTOS TEOLÓGICOS:\n\n${ragContext}\n\n---\n\nUtilize as informações acima dos documentos teológicos para enriquecer sua análise, mas mantenha a fidelidade ao texto bíblico.`
      usedRAG = true
    }
    
    const result = await analyzeWithAPI(aiId, config, enhancedPrompt, apiKey)
    
    // Adiciona flag de uso do RAG no resultado
    if (result.success) {
      result.usedRAG = usedRAG
      result.ragContextLength = ragContext ? ragContext.length : 0
    }
    
    return result
  } catch (error) {
    console.error(`Erro ao analisar com ${config.name}:`, error)
    return {
      aiId,
      aiName: config.name,
      icon: config.icon,
      success: false,
      error: error.message,
      content: null
    }
  }
}

/**
 * Análise via API - IMPLEMENTAÇÃO PARA TODAS AS IAs
 */
async function analyzeWithAPI(aiId, config, prompt, apiKey, retryCount = 0) {
  let response, data, content
  const maxRetries = 10 // Aumentado para garantir resposta do Gemini
  const baseDelay = 3000 // 3 segundos base

  try {
    // Cria AbortController para timeout de 60 segundos
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000)

    try {
      switch (aiId) {
        case 'gemini':
          response = await fetch(`${config.apiEndpoint}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ 
                parts: [{ text: prompt }] 
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192
              }
            })
          })
          data = await response.json()
          
          if (!response.ok) {
            // Mensagem amigável para erro 429 (cota excedida)
            if (response.status === 429) {
              const errorMsg = data?.error?.message || ''
              const waitMatch = errorMsg.match(/retry in ([\d.]+)s/)
              const waitTime = waitMatch ? Math.ceil(parseFloat(waitMatch[1])) : 60
              
              throw new Error(`⏱️ Seu limite gratuito do Gemini foi atingido (20 requisições por minuto). Aguarde ${waitTime} segundos e tente novamente, ou use Groq/Mistral enquanto isso. 💡 Dica: O plano gratuito do Gemini reseta a cada minuto.`)
            }
            
            // Retry AGRESSIVO com backoff exponencial limitado para erro 503
            if (response.status === 503 && retryCount < maxRetries) {
              // Backoff exponencial com cap de 15s (3s, 6s, 12s, 15s, 15s...)
              const delay = Math.min(baseDelay * Math.pow(1.5, retryCount), 15000)
              console.log(`⏳ Gemini sobrecarregado. Tentativa ${retryCount + 1}/${maxRetries}. Aguardando ${Math.round(delay/1000)}s... (outras IAs continuam em paralelo)`)
              await new Promise(resolve => setTimeout(resolve, delay))
              clearTimeout(timeoutId)
              return analyzeWithAPI(aiId, config, prompt, apiKey, retryCount + 1)
            }
            
            throw new Error(`Status ${response.status}: ${data?.error?.message || JSON.stringify(data)}`)
          }
          
          content = data.candidates?.[0]?.content?.parts?.[0]?.text
          break

      case 'anthropic':
        // Claude tem formato diferente
        response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: config.model,
            messages: [{ 
              role: 'user', 
              content: prompt 
            }],
            max_tokens: 8192,
            temperature: 0.7
          })
        })
        data = await response.json()
        
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error(`Rate limit atingido. Aguarde alguns segundos e tente novamente.`)
          }
          throw new Error(`Status ${response.status}: ${data?.error?.message || JSON.stringify(data)}`)
        }
        
        content = data.content?.[0]?.text
        break

      case 'groq':
      case 'mistral':
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }

        response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers,
          signal: controller.signal,
          body: JSON.stringify({
            model: config.model,
            messages: [{ 
              role: 'user', 
              content: prompt 
            }],
            temperature: 0.7,
            max_tokens: 8000
          })
        })
        data = await response.json()
        
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error(`Rate limit atingido. Aguarde alguns segundos e tente novamente.`)
          }
          throw new Error(`Status ${response.status}: ${data?.error?.message || data?.message || JSON.stringify(data)}`)
        }
        
        content = data.choices?.[0]?.message?.content
        break

      default:
        throw new Error(`IA ${aiId} não implementada`)
    }
    } finally {
      clearTimeout(timeoutId)
    }

    if (!content) {
      throw new Error('Resposta vazia da API')
    }

    return {
      aiId,
      aiName: config.name,
      icon: config.icon,
      success: true,
      content,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    // Trata erros de abort/timeout
    if (error.name === 'AbortError') {
      throw new Error(`Timeout (60s): API demorou muito para responder`)
    }
    throw new Error(`${error.message}`)
  }
}

/**
 * Salva API key de qualquer IA
 */
export function saveApiKey(aiId, apiKey) {
  const config = AI_CONFIGS[aiId]
  if (apiKey && apiKey.trim() && config) {
    localStorage.setItem(config.keyName, apiKey.trim())
    return true
  }
  return false
}

/**
 * Remove API key de qualquer IA
 */
export function removeApiKey(aiId) {
  const config = AI_CONFIGS[aiId]
  if (config) {
    localStorage.removeItem(config.keyName)
  }
}

/**
 * Verifica se tem API key configurada
 */
export function hasApiKey(aiId) {
  const config = AI_CONFIGS[aiId]
  return config ? !!localStorage.getItem(config.keyName) : false
}

/**
 * Obtém API key (se existir)
 */
export function getApiKey(aiId) {
  const config = AI_CONFIGS[aiId]
  return config ? localStorage.getItem(config.keyName) : null
}

/**
 * Obtém configurações de todas as IAs
 */
export function getAllAIConfigs() {
  return AI_CONFIGS
}

export default {
  analyzeWithAI,
  saveApiKey,
  removeApiKey,
  hasApiKey,
  getApiKey,
  getAllAIConfigs
}
