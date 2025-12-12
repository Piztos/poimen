import initSqlJs from 'sql.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '..', 'database', 'poimen.db')
const dbDir = path.dirname(dbPath)

// Criar diretório se não existir
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Inicializa SQL.js
const SQL = await initSqlJs()
let db

// Carrega banco existente ou cria novo
if (fs.existsSync(dbPath)) {
  const buffer = fs.readFileSync(dbPath)
  db = new SQL.Database(buffer)
} else {
  db = new SQL.Database()
}

// Função para salvar banco em arquivo
export function saveDatabase() {
  try {
    const data = db.export()
    fs.writeFileSync(dbPath, data)
  } catch (error) {
    console.error('Erro ao salvar banco:', error)
  }
}

// Salva automaticamente a cada 5 minutos
setInterval(saveDatabase, 5 * 60 * 1000)

// Salva ao encerrar
process.on('exit', saveDatabase)
process.on('SIGINT', () => {
  saveDatabase()
  process.exit(0)
})
process.on('SIGTERM', () => {
  saveDatabase()
  process.exit(0)
})

export function initDatabase() {
  // Criar tabela de histórico se não existir
  db.run(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      biblical_text TEXT NOT NULL,
      results TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  saveDatabase()

  console.log('✅ Banco de dados SQLite inicializado com sucesso')
}

export default db
