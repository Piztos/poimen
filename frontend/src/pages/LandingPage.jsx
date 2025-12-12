import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LandingPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
      {/* Header */}
      <header style={{ background: 'rgba(26, 26, 46, 0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(102, 126, 234, 0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '3rem' }}>🙏</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#818cf8' }}>Poimen</h1>
          </div>
          <Link
            to="/login"
            style={{ color: '#818cf8', fontWeight: '600', textDecoration: 'none', fontSize: '1.1rem', padding: '0.5rem 1.5rem', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '8px', border: '1px solid rgba(129, 140, 248, 0.3)' }}
          >
            Já tenho conta
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '3rem', alignItems: 'center' }}>
          {/* Left - Presentation */}
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '1.5rem', lineHeight: '1.2' }}>
              Análise Bíblica com{' '}
              <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Inteligência Artificial</span>
            </h2>
            
            <p style={{ fontSize: '1.25rem', color: '#cbd5e1', marginBottom: '2rem', lineHeight: '1.6' }}>
              Sistema teológico reformado que utiliza IA para aprofundar seus estudos bíblicos,
              com suporte a documentos permanentes (RAG) para personalização total.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>✨</span>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Suas Próprias Chaves API</h3>
                  <p style={{ color: '#94a3b8' }}>Use suas chaves Groq ou Gemini - sem limitações</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>📚</span>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Sistema RAG</h3>
                  <p style={{ color: '#94a3b8' }}>Upload de sermões, estudos e documentos permanentes</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🎯</span>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Teologia Reformada</h3>
                  <p style={{ color: '#94a3b8' }}>Análises fundamentadas na tradição reformada</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🔒</span>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Privacidade Total</h3>
                  <p style={{ color: '#94a3b8' }}>Seus documentos e configurações são privados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Sign Up Form */}
          <div style={{ background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', padding: '2.5rem', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '1.5rem' }}>
              Comece Gratuitamente
            </h3>

            {message && (
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: message.type === 'success' ? '#166534' : '#991b1b',
                  border: `1px solid ${message.type === 'success' ? '#86efac' : '#fca5a5'}`
                }}
              >
                {message.text}
                
                {tempPassword && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '0.5rem', border: '2px solid #a78bfa' }}>
                    <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Sua senha temporária:</p>
                    <p style={{ fontSize: '1.75rem', fontFamily: 'monospace', color: '#4f46e5', letterSpacing: '0.1em', fontWeight: 'bold' }}>
                      {tempPassword}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      Salve esta senha e{' '}
                      <Link to="/login" style={{ color: '#818cf8', fontWeight: '600', textDecoration: 'underline' }}>
                        faça login agora
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                  Seu Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid rgba(129, 140, 248, 0.3)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: 'rgba(30, 41, 59, 0.5)',
                    color: '#e2e8f0'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#818cf8'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(129, 140, 248, 0.3)'}
                />
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                  Você receberá uma senha temporária por email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#475569' : 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
                  color: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 15px rgba(129, 140, 248, 0.4)'
                }}
                onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
              >
                {loading ? 'Cadastrando...' : 'Criar Conta Grátis'}
              </button>
            </form>

            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
              Ao se cadastrar, você poderá configurar suas chaves API (Groq/Gemini)
              e começar a usar o sistema imediatamente.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ marginTop: '6rem', display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr', gap: '2rem' }}>
          <div style={{ textAlign: 'center', background: 'rgba(30, 41, 59, 0.6)', padding: '2rem', borderRadius: '1rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
            <h4 style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>Suas APIs</h4>
            <p style={{ color: '#94a3b8' }}>
              Configure Groq (gratuito) ou Gemini e use sem limitações do sistema
            </p>
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(30, 41, 59, 0.6)', padding: '2rem', borderRadius: '1rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
            <h4 style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>Upload de Documentos</h4>
            <p style={{ color: '#94a3b8' }}>
              PDFs, DOCXs, sermões - tudo integrado ao sistema de análise
            </p>
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(30, 41, 59, 0.6)', padding: '2rem', borderRadius: '1rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💾</div>
            <h4 style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>Histórico Completo</h4>
            <p style={{ color: '#94a3b8' }}>
              Todas as suas análises salvas e exportáveis
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: 'rgba(26, 26, 46, 0.95)', color: '#e2e8f0', marginTop: '6rem', padding: '3rem 0', borderTop: '1px solid rgba(129, 140, 248, 0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>🙏 Poimen - Sistema de Análise Bíblica Reformada</p>
          <p style={{ color: '#94a3b8' }}>
            Use suas próprias chaves API • Privacidade garantida • Código aberto
          </p>
        </div>
      </footer>
    </div>
  );
}
