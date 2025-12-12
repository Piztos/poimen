import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import dotenv from 'dotenv'
import historyRoutes from './routes/historyRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import authRoutes from './routes/authRoutes.js'
import analysisRoutes from './routes/analysisRoutes.js'
import { initDatabase } from './database/init.js'
import { initRAG } from './services/documentService.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Inicializar banco de dados e RAG
initDatabase()
initRAG().then(() => {
  console.log('📚 Sistema RAG pronto')
}).catch(err => {
  console.error('❌ Erro ao inicializar RAG:', err)
})

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/documents', documentRoutes)

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Poimén API está funcionando',
    timestamp: new Date().toISOString()
  })
})

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    name: 'Poimén API',
    version: '1.0.0',
    description: 'Backend para sistema de estudos bíblicos reformados',
    endpoints: {
      health: '/api/health',
      history: '/api/history'
    }
  })
})

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path
  })
})

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Poimén rodando na porta ${PORT}`)
  console.log(`📖 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`)
})

export default app
