import express from 'express'
import {
  getAllHistory,
  getHistoryById,
  createHistory,
  deleteHistory
} from '../controllers/historyController.js'

const router = express.Router()

// GET /api/history - Buscar todo o histórico
router.get('/', getAllHistory)

// GET /api/history/:id - Buscar histórico por ID
router.get('/:id', getHistoryById)

// POST /api/history - Criar novo histórico
router.post('/', createHistory)

// DELETE /api/history/:id - Deletar histórico
router.delete('/:id', deleteHistory)

export default router
