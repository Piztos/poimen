import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../database/users.db');
const db = new Database(dbPath);

// Criar tabela de usuários se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    groq_api_key TEXT,
    gemini_api_key TEXT,
    has_configured_keys INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  )
`);

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'poimen-secret-key-change-in-production';

class User {
  static async create(email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    try {
      const stmt = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
      `);
      
      const result = stmt.run(email, passwordHash);
      return { id: result.lastInsertRowid, email };
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Email já cadastrado');
      }
      throw error;
    }
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static async verifyPassword(email, password) {
    const user = this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;

    // Atualizar last_login
    const updateStmt = db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
    updateStmt.run(user.id);

    return user;
  }

  static encryptApiKey(apiKey) {
    if (!apiKey) return null;
    return CryptoJS.AES.encrypt(apiKey, ENCRYPTION_KEY).toString();
  }

  static decryptApiKey(encryptedKey) {
    if (!encryptedKey) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedKey, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static updateApiKeys(userId, groqKey, geminiKey) {
    const encryptedGroq = this.encryptApiKey(groqKey);
    const encryptedGemini = this.encryptApiKey(geminiKey);

    const stmt = db.prepare(`
      UPDATE users 
      SET groq_api_key = ?, 
          gemini_api_key = ?, 
          has_configured_keys = 1
      WHERE id = ?
    `);

    stmt.run(encryptedGroq, encryptedGemini, userId);
    return true;
  }

  static getApiKeys(userId) {
    const user = this.findById(userId);
    if (!user) return null;

    return {
      groqApiKey: this.decryptApiKey(user.groq_api_key),
      geminiApiKey: this.decryptApiKey(user.gemini_api_key),
      hasConfiguredKeys: user.has_configured_keys === 1
    };
  }

  static getUserInfo(userId) {
    const user = this.findById(userId);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      hasConfiguredKeys: user.has_configured_keys === 1,
      createdAt: user.created_at,
      lastLogin: user.last_login
    };
  }
}

export default User;
