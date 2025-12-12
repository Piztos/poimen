import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ApiKeysModal({ isOpen, onClose }) {
  const { updateApiKeys, user } = useAuth();
  const [groqKey, setGroqKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!groqKey && !geminiKey) {
      setError('Configure pelo menos uma chave API');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateApiKeys(groqKey, geminiKey);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Configure suas Chaves API
          </h2>
          <p className="text-gray-600">
            Para usar o Poimen, você precisa de pelo menos uma chave API (Groq ou Gemini).
            Suas chaves ficam criptografadas e são usadas apenas quando você faz análises.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
            ✅ Chaves salvas com sucesso! Redirecionando...
          </div>
        )}

        <div className="space-y-8">
          {/* Groq API Key */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl">🚀</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Groq API Key (Recomendado)</h3>
                <p className="text-sm text-gray-600">Rápido e gratuito • Modelo: Mixtral 8x7B</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chave API do Groq
              </label>
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="font-semibold text-indigo-900 mb-2">📝 Como obter:</p>
              <ol className="text-sm text-indigo-800 space-y-1 list-decimal list-inside">
                <li>Acesse <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">console.groq.com</a></li>
                <li>Crie uma conta (gratuito)</li>
                <li>Vá em "API Keys"</li>
                <li>Clique em "Create API Key"</li>
                <li>Copie e cole aqui</li>
              </ol>
            </div>
          </div>

          {/* Gemini API Key */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl">✨</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Gemini API Key (Alternativa)</h3>
                <p className="text-sm text-gray-600">Google AI • Modelo: Gemini Pro</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chave API do Gemini
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-semibold text-purple-900 mb-2">📝 Como obter:</p>
              <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
                <li>Acesse <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google AI Studio</a></li>
                <li>Faça login com sua conta Google</li>
                <li>Clique em "Get API key"</li>
                <li>Crie um novo projeto ou use existente</li>
                <li>Copie e cole aqui</li>
              </ol>
              <p className="text-xs text-purple-700 mt-2">
                ⚠️ Limite gratuito: 60 requisições/minuto
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          {!user?.hasConfiguredKeys && (
            <p className="text-sm text-gray-500 flex-1">
              Configure pelo menos uma chave para continuar
            </p>
          )}
          
          <button
            onClick={handleSave}
            disabled={loading || success}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : success ? '✓ Salvo!' : 'Salvar e Continuar'}
          </button>

          {user?.hasConfiguredKeys && (
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
