import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import User from '../models/User.js';
import { getRAGContext } from '../services/documentService.js';

const router = express.Router();

// Análise com IA (protegida, usa API keys do usuário)
router.post('/analyze', verifyToken, async (req, res) => {
  try {
    const { question, provider = 'groq', useRAG = true } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Pergunta é obrigatória' });
    }

    // Obter API keys do usuário
    const userKeys = User.getApiKeys(req.userId);

    if (!userKeys.hasConfiguredKeys) {
      return res.status(403).json({ 
        error: 'Configure suas chaves API antes de usar o sistema',
        needsConfiguration: true
      });
    }

    let apiKey;
    if (provider === 'groq') {
      apiKey = userKeys.groqApiKey;
      if (!apiKey) {
        return res.status(403).json({ error: 'Chave Groq não configurada' });
      }
    } else if (provider === 'gemini') {
      apiKey = userKeys.geminiApiKey;
      if (!apiKey) {
        return res.status(403).json({ error: 'Chave Gemini não configurada' });
      }
    } else {
      return res.status(400).json({ error: 'Provider inválido. Use "groq" ou "gemini"' });
    }

    // Obter contexto RAG se habilitado
    let ragContext = '';
    let usedRAG = false;
    
    if (useRAG) {
      try {
        ragContext = await getRAGContext(question);
        usedRAG = ragContext.length > 0;
      } catch (error) {
        console.error('Erro ao buscar contexto RAG:', error);
      }
    }

    // Chamar API escolhida com a chave do usuário
    let result;
    if (provider === 'groq') {
      result = await callGroqAPI(question, ragContext, apiKey);
    } else {
      result = await callGeminiAPI(question, ragContext, apiKey);
    }

    res.json({
      success: true,
      answer: result,
      usedRAG,
      provider
    });

  } catch (error) {
    console.error('Erro na análise:', error);
    res.status(500).json({ error: error.message || 'Erro ao processar análise' });
  }
});

// Função para chamar Groq API
async function callGroqAPI(question, context, apiKey) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'system',
          content: `Você é um teólogo reformado especializado em análise bíblica.
${context ? `\nCONTEXTO DE DOCUMENTOS PERMANENTES:\n${context}\n` : ''}
Responda com profundidade teológica, citando versículos quando relevante.`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Erro na API Groq');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Função para chamar Gemini API
async function callGeminiAPI(question, context, apiKey) {
  const prompt = `${context ? `CONTEXTO DE DOCUMENTOS PERMANENTES:\n${context}\n\n` : ''}${question}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        systemInstruction: {
          parts: [{ text: 'Você é um teólogo reformado especializado em análise bíblica. Responda com profundidade teológica, citando versículos quando relevante.' }]
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Erro na API Gemini');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export default router;
