import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { sendWelcomeEmail, generateTemporaryPassword } from '../utils/emailService.js';

const router = express.Router();

// Registro de novo usuário
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Gerar senha temporária
    const temporaryPassword = generateTemporaryPassword();

    // Criar usuário
    const user = await User.create(email, temporaryPassword);

    // Enviar email
    const emailResult = await sendWelcomeEmail(email, temporaryPassword);

    res.json({
      success: true,
      message: emailResult.devMode 
        ? 'Usuário criado! Senha exibida no console do servidor (modo dev)'
        : 'Cadastro realizado! Verifique seu email para obter a senha.',
      userId: user.id,
      devMode: emailResult.devMode,
      temporaryPassword: emailResult.devMode ? temporaryPassword : undefined
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(400).json({ error: error.message || 'Erro ao criar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await User.verifyPassword(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const token = generateToken(user.id, user.email);
    const userInfo = User.getUserInfo(user.id);

    res.json({
      success: true,
      token,
      user: userInfo
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Verificar token (para manter usuário logado)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7);
    const decoded = require('jsonwebtoken').verify(
      token, 
      process.env.JWT_SECRET || 'poimen-jwt-secret-change-in-production'
    );

    const userInfo = User.getUserInfo(decoded.userId);

    if (!userInfo) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ success: true, user: userInfo });

  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Atualizar API keys
router.post('/update-keys', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7);
    const decoded = require('jsonwebtoken').verify(
      token,
      process.env.JWT_SECRET || 'poimen-jwt-secret-change-in-production'
    );

    const { groqApiKey, geminiApiKey } = req.body;

    if (!groqApiKey && !geminiApiKey) {
      return res.status(400).json({ 
        error: 'Forneça pelo menos uma chave API (Groq ou Gemini)' 
      });
    }

    User.updateApiKeys(decoded.userId, groqApiKey, geminiApiKey);

    res.json({
      success: true,
      message: 'Chaves API atualizadas com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar keys:', error);
    res.status(500).json({ error: 'Erro ao atualizar chaves API' });
  }
});

// Obter status das API keys
router.get('/keys-status', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7);
    const decoded = require('jsonwebtoken').verify(
      token,
      process.env.JWT_SECRET || 'poimen-jwt-secret-change-in-production'
    );

    const keys = User.getApiKeys(decoded.userId);

    res.json({
      success: true,
      hasGroqKey: !!keys.groqApiKey,
      hasGeminiKey: !!keys.geminiApiKey,
      hasConfiguredKeys: keys.hasConfiguredKeys
    });

  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

export default router;
