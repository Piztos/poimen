import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
import mammoth from 'mammoth'
import { pipeline } from '@xenova/transformers'

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

// Base de dados em memória  
let documentsIndex = []
let embedder = null

// Diretórios
const DOCS_DIR_PERMANENT = path.join(process.cwd(), 'data', 'documents', 'permanent')
const DOCS_DIR_TEMPORARY = path.join(process.cwd(), 'data', 'documents', 'temporary')
const INDEX_FILE = path.join(process.cwd(), 'data', 'documents-index.json')

// Garantir que os diretórios existem
if (!fs.existsSync(DOCS_DIR_PERMANENT)) {
  fs.mkdirSync(DOCS_DIR_PERMANENT, { recursive: true })
}
if (!fs.existsSync(DOCS_DIR_TEMPORARY)) {
  fs.mkdirSync(DOCS_DIR_TEMPORARY, { recursive: true })
}

/**
 * Similaridade de coseno
 */
function cosineSimilarity(a, b) {
  let dotProduct = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Carrega índice
 */
function loadIndex() {
  try {
    if (fs.existsSync(INDEX_FILE)) {
      documentsIndex = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'))
      console.log(`✅ ${documentsIndex.length} chunks carregados`)
    }
  } catch (error) {
    console.error('Erro ao carregar índice:', error)
  }
}

/**
 * Salva índice
 */
function saveIndex() {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(documentsIndex, null, 2))
}

/**
 * Inicializa RAG
 */
export async function initRAG() {
  try {
    console.log('🔧 Inicializando RAG...')
    embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small')
    console.log('✅ Modelo de embeddings carregado')
    loadIndex()
    return true
  } catch (error) {
    console.error('❌ Erro ao inicializar RAG:', error)
    return false
  }
}

/**
 * Extrai texto de PDF
 */
async function extractPDF(filePath) {
  try {
    console.log('🔍 Lendo PDF:', filePath)
    const dataBuffer = fs.readFileSync(filePath)
    console.log('📦 Buffer size:', dataBuffer.length, 'bytes')
    const data = await pdfParse(dataBuffer)
    console.log('✅ Texto extraído:', data.text.length, 'caracteres')
    console.log('📄 Páginas:', data.numpages)
    console.log('📝 Amostra do texto:', data.text.substring(0, 200))
    return data.text
  } catch (error) {
    console.error('❌ Erro ao extrair PDF:', error)
    throw error
  }
}

/**
 * Extrai texto de DOCX
 */
async function extractDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath })
  return result.value
}

/**
 * Extrai texto de TXT
 */
function extractTXT(filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

/**
 * Divide em chunks
 */
function splitChunks(text, size = 500, overlap = 50) {
  const words = text.split(/\s+/)
  const chunks = []
  for (let i = 0; i < words.length; i += size - overlap) {
    chunks.push(words.slice(i, i + size).join(' '))
  }
  return chunks.filter(c => c.trim().length > 0)
}

/**
 * Gera embedding
 */
async function getEmbedding(text) {
  if (!embedder) throw new Error('Embedder não inicializado')
  const output = await embedder(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

/**
 * Calcula tamanho total dos documentos permanentes
 */
export async function getPermanentDocumentsSize() {
  try {
    let totalSize = 0
    
    if (fs.existsSync(DOCS_DIR_PERMANENT)) {
      const files = fs.readdirSync(DOCS_DIR_PERMANENT)
      files.forEach(file => {
        const filePath = path.join(DOCS_DIR_PERMANENT, file)
        const stats = fs.statSync(filePath)
        totalSize += stats.size
      })
    }
    
    return totalSize
  } catch (error) {
    console.error('Erro ao calcular tamanho:', error)
    return 0
  }
}

/**
 * Processa documento
 */
export async function processDocument(file, isPermanent = false) {
  try {
    const { originalname, path: filePath, mimetype, size } = file
    
    // Valida tipo de arquivo para permanentes (apenas PDF)
    if (isPermanent && mimetype !== 'application/pdf') {
      throw new Error('Documentos permanentes devem ser em formato PDF')
    }
    
    // Verifica limite de tamanho para permanentes (150MB)
    if (isPermanent) {
      const currentSize = await getPermanentDocumentsSize()
      const MAX_PERMANENT_SIZE = 150 * 1024 * 1024 // 150MB
      
      if (currentSize + size > MAX_PERMANENT_SIZE) {
        const currentMB = (currentSize / (1024 * 1024)).toFixed(2)
        const fileMB = (size / (1024 * 1024)).toFixed(2)
        throw new Error(`Limite de armazenamento permanente atingido! Você tem ${currentMB}MB e está tentando adicionar ${fileMB}MB. Limite máximo: 150MB. Por favor, remova alguns documentos permanentes.`)
      }
    }
    
    // Extrai texto
    let text = ''
    if (mimetype === 'application/pdf') {
      text = await extractPDF(filePath)
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await extractDOCX(filePath)
    } else if (mimetype === 'text/plain') {
      text = extractTXT(filePath)
    } else {
      throw new Error('Tipo não suportado')
    }
    
    if (!text.trim()) {
      throw new Error('Não foi possível extrair texto do documento. O PDF pode estar protegido, corrompido, ou conter apenas imagens (PDF escaneado). Tente converter o documento para um formato com texto selecionável.')
    }
    
    // Divide em chunks
    const chunks = splitChunks(text)
    const docId = `doc_${Date.now()}`
    const sessionType = isPermanent ? 'permanent' : 'temporary'
    
    // Gera embeddings e indexa
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await getEmbedding(chunks[i])
      documentsIndex.push({
        chunkId: `${docId}_${i}`,
        docId,
        filename: originalname,
        text: chunks[i],
        embedding,
        chunkIndex: i,
        totalChunks: chunks.length,
        uploadDate: new Date().toISOString(),
        isPermanent,
        sessionType,
        // Analytics
        lastUsed: null,
        usageCount: 0,
        relevanceScore: 0,
        relevanceCount: 0
      })
    }
    
    // Salva
    saveIndex()
    const targetDir = isPermanent ? DOCS_DIR_PERMANENT : DOCS_DIR_TEMPORARY
    const newPath = path.join(targetDir, `${docId}_${originalname}`)
    fs.renameSync(filePath, newPath)
    
    return {
      docId,
      filename: originalname,
      chunks: chunks.length,
      size: text.length,
      isPermanent,
      sessionType
    }
  } catch (error) {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }
    throw error
  }
}

/**
 * Busca documentos
 */
export async function searchDocuments(query, topK = 3) {
  try {
    if (!embedder || documentsIndex.length === 0) {
      return []
    }
    
    const queryEmbedding = await getEmbedding(query)
    
    // Calcula similaridades
    const results = documentsIndex.map(doc => ({
      ...doc,
      similarity: cosineSimilarity(queryEmbedding, doc.embedding)
    }))
    
    // Ordena e retorna top K
    const topResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
    
    // Atualiza analytics
    const now = new Date().toISOString()
    topResults.forEach(result => {
      const docChunks = documentsIndex.filter(c => c.docId === result.docId)
      docChunks.forEach(chunk => {
        chunk.lastUsed = now
        chunk.usageCount++
        // Se estava no top 3, incrementa relevância
        if (result.similarity > 0.5) {
          chunk.relevanceScore += result.similarity
          chunk.relevanceCount++
        }
      })
    })
    saveIndex()
    
    return topResults.map(({ text, filename, chunkIndex, similarity, category, isPermanent }) => ({
      text,
      metadata: { 
        filename, 
        chunkIndex,
        category: isPermanent ? category : null,
        isPermanent
      },
      distance: 1 - similarity
    }))
  } catch (error) {
    console.error('Erro na busca:', error)
    return []
  }
}

/**
 * Lista documentos
 */
export async function listDocuments() {
  const docsMap = new Map()
  documentsIndex.forEach(chunk => {
    if (!docsMap.has(chunk.docId)) {
      docsMap.set(chunk.docId, {
        docId: chunk.docId,
        filename: chunk.filename,
        uploadDate: chunk.uploadDate,
        chunks: chunk.totalChunks,
        isPermanent: chunk.isPermanent || false,
        sessionType: chunk.sessionType || 'temporary',
        category: chunk.category || null,
        lastUsed: chunk.lastUsed,
        usageCount: chunk.usageCount || 0,
        relevanceScore: chunk.relevanceScore || 0,
        relevanceCount: chunk.relevanceCount || 0
      })
    } else {
      // Acumula métricas de todos os chunks do documento
      const doc = docsMap.get(chunk.docId)
      doc.usageCount = Math.max(doc.usageCount, chunk.usageCount || 0)
      doc.relevanceScore = Math.max(doc.relevanceScore, chunk.relevanceScore || 0)
      doc.relevanceCount = Math.max(doc.relevanceCount, chunk.relevanceCount || 0)
      if (chunk.lastUsed && (!doc.lastUsed || chunk.lastUsed > doc.lastUsed)) {
        doc.lastUsed = chunk.lastUsed
      }
    }
  })
  return Array.from(docsMap.values())
}

/**
 * Deleta documento
 */
export async function deleteDocument(docId) {
  try {
    const chunks = documentsIndex.filter(c => c.docId === docId)
    if (chunks.length === 0) return false
    
    // Remove do índice
    documentsIndex = documentsIndex.filter(c => c.docId !== docId)
    saveIndex()
    
    // Remove arquivo
    const filename = chunks[0].filename
    const isPermanent = chunks[0].isPermanent
    const targetDir = isPermanent ? DOCS_DIR_PERMANENT : DOCS_DIR_TEMPORARY
    const filePath = path.join(targetDir, `${docId}_${filename}`)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    
    return true
  } catch (error) {
    console.error('Erro ao deletar:', error)
    return false
  }
}

/**
 * Limpa todos os documentos temporários
 */
export async function clearTemporaryDocuments() {
  try {
    // Remove do índice
    const tempChunks = documentsIndex.filter(c => !c.isPermanent)
    documentsIndex = documentsIndex.filter(c => c.isPermanent)
    saveIndex()
    
    // Remove arquivos
    if (fs.existsSync(DOCS_DIR_TEMPORARY)) {
      const files = fs.readdirSync(DOCS_DIR_TEMPORARY)
      files.forEach(file => {
        const filePath = path.join(DOCS_DIR_TEMPORARY, file)
        fs.unlinkSync(filePath)
      })
    }
    
    console.log(`🗑️  ${tempChunks.length} chunks temporários removidos`)
    return { removed: tempChunks.length }
  } catch (error) {
    console.error('Erro ao limpar temporários:', error)
    throw error
  }
}

/**
 * Retorna estatísticas de armazenamento
 */
export async function getStorageStats() {
  const permanentSize = await getPermanentDocumentsSize()
  const permanentDocs = documentsIndex.filter(c => c.isPermanent)
  const uniquePermanentDocs = [...new Set(permanentDocs.map(c => c.docId))].length
  
  return {
    permanentSize,
    permanentSizeMB: (permanentSize / (1024 * 1024)).toFixed(2),
    maxSizeMB: 150,
    usagePercent: ((permanentSize / (150 * 1024 * 1024)) * 100).toFixed(1),
    permanentDocsCount: uniquePermanentDocs,
    isNearLimit: permanentSize > 120 * 1024 * 1024 // Aviso aos 120MB
  }
}
