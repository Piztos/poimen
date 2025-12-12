import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LandingPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [tempPassword, setTempPassword] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setTempPassword(null);

    try {
      const result = await register(email);
      
      if (result.devMode) {
        setTempPassword(result.temporaryPassword);
        setMessage({
          type: 'success',
          text: 'Cadastro realizado! Sua senha temporária está abaixo.'
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Cadastro realizado! Verifique seu email para obter a senha.'
        });
      }
      
      setEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🙏</span>
            <h1 className="text-2xl font-bold text-indigo-600">Poimen</h1>
          </div>
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Já tenho conta
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Presentation */}
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Análise Bíblica com
              <span className="text-indigo-600"> Inteligência Artificial</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              Sistema teológico reformado que utiliza IA para aprofundar seus estudos bíblicos,
              com suporte a documentos permanentes (RAG) para personalização total.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Suas Próprias Chaves API</h3>
                  <p className="text-gray-600">Use suas chaves Groq ou Gemini - sem limitações</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Sistema RAG</h3>
                  <p className="text-gray-600">Upload de sermões, estudos e documentos permanentes</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Teologia Reformada</h3>
                  <p className="text-gray-600">Análises fundamentadas na tradição reformada</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Privacidade Total</h3>
                  <p className="text-gray-600">Seus documentos e configurações são privados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Sign Up Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Comece Gratuitamente
            </h3>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
                
                {tempPassword && (
                  <div className="mt-4 p-3 bg-white rounded border-2 border-indigo-300">
                    <p className="font-semibold text-gray-900 mb-2">Sua senha temporária:</p>
                    <p className="text-2xl font-mono text-indigo-600 tracking-wider">
                      {tempPassword}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Salve esta senha e{' '}
                      <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                        faça login agora
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Seu Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Você receberá uma senha temporária por email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Cadastrando...' : 'Criar Conta Grátis'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Ao se cadastrar, você poderá configurar suas chaves API (Groq/Gemini)
              e começar a usar o sistema imediatamente.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🔑</div>
            <h4 className="font-bold text-lg text-gray-900 mb-2">Suas APIs</h4>
            <p className="text-gray-600">
              Configure Groq (gratuito) ou Gemini e use sem limitações do sistema
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">📖</div>
            <h4 className="font-bold text-lg text-gray-900 mb-2">Upload de Documentos</h4>
            <p className="text-gray-600">
              PDFs, DOCXs, sermões - tudo integrado ao sistema de análise
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">💾</div>
            <h4 className="font-bold text-lg text-gray-900 mb-2">Histórico Completo</h4>
            <p className="text-gray-600">
              Todas as suas análises salvas e exportáveis
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg mb-2">🙏 Poimen - Sistema de Análise Bíblica Reformada</p>
          <p className="text-gray-400">
            Use suas próprias chaves API • Privacidade garantida • Código aberto
          </p>
        </div>
      </footer>
    </div>
  );
}
