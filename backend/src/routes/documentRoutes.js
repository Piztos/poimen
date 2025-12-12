import express from 'express'
import multer from 'multer'
import path from 'path'
import {
  processDocument,
  searchDocuments,
  listDocuments,
  deleteDocument,
  clearTemporaryDocuments,
  getStorageStats
} from '../services/documentService.js'

const router = express.Router()

// Configuração do multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use PDF, DOCX ou TXT'))
    }
  }
})

/**
 * POST /api/documents/upload
 * Faz upload e processa documento
 */
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' })
    }
    
    const isPermanent = req.body.isPermanent === 'true'
    
    const result = await processDocument(req.file, isPermanent)
    
    res.json({
      success: true,
      message: 'Documento processado com sucesso',
      data: result
    })
  } catch (error) {
    console.error('Erro ao processar documento:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao processar documento'
    })
  }
})

/**
 * POST /api/documents/search
 * Busca documentos relevantes
 */
router.post('/search', async (req, res) => {
  try {
    const { query, topK = 3 } = req.body
    
    if (!query) {
      return res.status(400).json({ error: 'Query é obrigatória' })
    }
    
    const results = await searchDocuments(query, topK)
    
    res.json({
      success: true,
      results
    })
  } catch (error) {
    console.error('Erro na busca:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * GET /api/documents
 * Lista todos os documentos
 */
router.get('/', async (req, res) => {
  try {
    const documents = await listDocuments()
    const stats = await getStorageStats()
    
    res.json({
      success: true,
      documents,
      storage: stats
    })
  } catch (error) {
    console.error('Erro ao listar documentos:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * DELETE /api/documents/:docId
 * Deleta documento
 */
router.delete('/:docId', async (req, res) => {
  try {
    const { docId } = req.params
    
    const success = await deleteDocument(docId)
    
    if (success) {
      res.json({
        success: true,
        message: 'Documento deletado com sucesso'
      })
    } else {
      res.status(404).json({
        success: false,
        error: 'Documento não encontrado'
      })
    }
  } catch (error) {
    console.error('Erro ao deletar documento:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * DELETE /api/documents/temporary/clear
 * Limpa todos os documentos temporários
 */
router.delete('/temporary/clear', async (req, res) => {
  try {
    const result = await clearTemporaryDocuments()
    
    res.json({
      success: true,
      message: `${result.removed} documentos temporários removidos`,
      data: result
    })
  } catch (error) {
    console.error('Erro ao limpar documentos temporários:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

export default router
