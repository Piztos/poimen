import db, { saveDatabase } from '../database/init.js'

// Buscar todo o histórico
export function getAllHistory(req, res) {
  try {
    const rows = db.exec('SELECT * FROM history ORDER BY created_at DESC')
    
    if (!rows[0]) {
      return res.json([])
    }

    const columns = rows[0].columns
    const values = rows[0].values

    const history = values.map(row => {
      const obj = {}
      columns.forEach((col, i) => {
        obj[col] = row[i]
      })
      return {
        id: obj.id,
        biblicalText: obj.biblical_text,
        results: JSON.parse(obj.results),
        timestamp: obj.timestamp,
        createdAt: obj.created_at
      }
    })

    res.json(history)
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    res.status(500).json({ error: 'Erro ao buscar histórico' })
  }
}

// Buscar histórico por ID
export function getHistoryById(req, res) {
  try {
    const { id } = req.params
    const rows = db.exec('SELECT * FROM history WHERE id = ?', [id])

    if (!rows[0] || rows[0].values.length === 0) {
      return res.status(404).json({ error: 'Histórico não encontrado' })
    }

    const columns = rows[0].columns
    const values = rows[0].values[0]
    const obj = {}
    columns.forEach((col, i) => {
      obj[col] = values[i]
    })

    const history = {
      id: obj.id,
      biblicalText: obj.biblical_text,
      results: JSON.parse(obj.results),
      timestamp: obj.timestamp,
      createdAt: obj.created_at
    }

    res.json(history)
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    res.status(500).json({ error: 'Erro ao buscar histórico' })
  }
}

// Criar novo histórico
export function createHistory(req, res) {
  try {
    const { biblicalText, results, timestamp } = req.body

    if (!biblicalText || !results || !timestamp) {
      return res.status(400).json({
        error: 'Dados incompletos. Envie biblicalText, results e timestamp'
      })
    }

    db.run(
      'INSERT INTO history (biblical_text, results, timestamp) VALUES (?, ?, ?)',
      [biblicalText, JSON.stringify(results), timestamp]
    )
    
    // Pega o último ID inserido
    const lastIdRows = db.exec('SELECT last_insert_rowid() as id')
    const lastId = lastIdRows[0].values[0][0]
    
    saveDatabase()

    res.status(201).json({
      id: lastId,
      biblicalText,
      results,
      timestamp,
      message: 'Histórico salvo com sucesso'
    })
  } catch (error) {
    console.error('Erro ao criar histórico:', error)
    res.status(500).json({ error: 'Erro ao criar histórico' })
  }
}

// Deletar histórico
export function deleteHistory(req, res) {
  try {
    const { id } = req.params

    // Verifica se existe
    const existsRows = db.exec('SELECT id FROM history WHERE id = ?', [id])
    if (!existsRows[0] || existsRows[0].values.length === 0) {
      return res.status(404).json({ error: 'Histórico não encontrado' })
    }

    db.run('DELETE FROM history WHERE id = ?', [id])
    saveDatabase()

    res.json({ message: 'Histórico deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar histórico:', error)
    res.status(500).json({ error: 'Erro ao deletar histórico' })
  }
}
