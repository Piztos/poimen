import React from 'react'
import { BookOpen, Heart, Sparkles, Zap, Globe } from 'lucide-react'
import './AboutPage.css'

function AboutPage() {
  const technologies = [
    'React + Vite',
    'Node.js + Express',
    'SQLite',
    'Electron (Desktop)',
    'Capacitor (Mobile)',
    'HTML2PDF',
    'DOCX.js',
    'Marked (Markdown)'
  ]

  const ais = [
    { name: 'Google Gemini', icon: '🔮', description: 'API gratuita do Google' },
    { name: 'ChatGPT', icon: '🤖', description: 'Interface web gratuita da OpenAI' },
    { name: 'DeepSeek', icon: '🧠', description: 'API/Interface gratuita' },
    { name: 'Microsoft Copilot', icon: '🪁', description: 'Interface web gratuita da Microsoft' }
  ]

  const features = [
    'Análise exegética completa (histórica, gramatical, literária)',
    'Base na teologia reformada clássica',
    'Estruturação de sermões expositivos',
    'Múltiplas IAs gratuitas trabalhando simultaneamente',
    'Exportação em diversos formatos (PDF, DOCX, Markdown, TXT)',
    'Histórico de análises salvas',
    'Interface responsiva e multiplataforma',
    'Totalmente gratuito e open-source'
  ]

  return (
    <div className="about-page">
      <div className="about-hero">
        <BookOpen size={64} className="about-hero-icon" />
        <h1>Poimén</h1>
        <p className="about-subtitle">ποιμήν - Construtor do Conhecimento Teológico</p>
      </div>

      <section className="about-section card">
        <div className="section-icon">
          <Heart size={32} />
        </div>
        <h2>Sobre o Poimén</h2>
        <p>
          Poimén é um sistema completo, multiplataforma e totalmente gratuito para estudos bíblicos
          reformados. O nome vem do grego ποιμήν (poimén), que significa "pastor", refletindo a missão
          de guiar estudantes sérios da Palavra de Deus através de análises profundas e fiéis.
        </p>
        <p>
          Este sistema combina o melhor da tecnologia moderna com a tradição reformada histórica,
          permitindo que múltiplas IAs gratuitas trabalhem simultaneamente para fornecer análises
          exegéticas completas de textos bíblicos.
        </p>
      </section>

      <section className="about-section card">
        <div className="section-icon">
          <Sparkles size={32} />
        </div>
        <h2>Inteligências Artificiais Integradas</h2>
        <div className="ai-list">
          {ais.map((ai, index) => (
            <div key={index} className="ai-item">
              <span className="ai-item-icon">{ai.icon}</span>
              <div>
                <h4>{ai.name}</h4>
                <p>{ai.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="alert alert-info">
          <p>
            <strong>Nota:</strong> Todas as IAs utilizadas são 100% gratuitas. O sistema usa APIs gratuitas
            quando disponíveis, ou permite integração manual via interface web.
          </p>
        </div>
      </section>

      <section className="about-section card">
        <div className="section-icon">
          <Zap size={32} />
        </div>
        <h2>Recursos Principais</h2>
        <ul className="features-list">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="about-section card">
        <div className="section-icon">
          <Globe size={32} />
        </div>
        <h2>Tecnologias Utilizadas</h2>
        <p>
          O Poimén foi construído com tecnologias modernas, open-source e totalmente gratuitas:
        </p>
        <div className="tech-grid">
          {technologies.map((tech, index) => (
            <div key={index} className="tech-badge">
              {tech}
            </div>
          ))}
        </div>
      </section>

      <section className="about-section card">
        <div className="section-icon">
          <BookOpen size={32} />
        </div>
        <h2>Metodologia de Análise</h2>
        <p>
          O agente Poimén segue uma metodologia rigorosa de análise bíblica reformada:
        </p>
        <div className="methodology">
          <div className="methodology-item">
            <h4>1. Análise Histórica</h4>
            <p>Contexto histórico, cultural e geográfico da perícope</p>
          </div>
          <div className="methodology-item">
            <h4>2. Análise Gramatical</h4>
            <p>Estudo dos originais (hebraico, grego, aramaico)</p>
          </div>
          <div className="methodology-item">
            <h4>3. Análise Literária</h4>
            <p>Estilo literário, gênero e estrutura do texto</p>
          </div>
          <div className="methodology-item">
            <h4>4. Estruturação de Sermão</h4>
            <p>Organização expositiva com introdução, desenvolvimento e conclusão</p>
          </div>
          <div className="methodology-item">
            <h4>5. Aplicação Prática</h4>
            <p>Conexão com Cristo e aplicação contemporânea</p>
          </div>
        </div>
      </section>

      <section className="about-section card about-footer-section">
        <h2>Base Teológica</h2>
        <p>
          Todas as análises são fundamentadas na tradição reformada histórica, priorizando autores como:
        </p>
        <p className="authors-text">
          João Calvino, Charles Spurgeon, John Piper, Timothy Keller, D.A. Carson, J.I. Packer,
          John Stott, Wayne Grudem, Herman Bavinck, Louis Berkhof, Augustus Nicodemus, entre outros.
        </p>
        <div className="alert alert-success">
          <p>
            <strong>A Escritura é a autoridade máxima.</strong> A Bíblia está acima de qualquer
            citação ou autor. Para o Poimén, a Palavra de Deus é a base suprema de toda argumentação.
          </p>
        </div>
      </section>

      <div className="about-cta">
        <h2>Feito com <Heart size={20} className="heart-inline" /> para a glória de Deus</h2>
        <p>Sistema totalmente gratuito e open-source</p>
      </div>
    </div>
  )
}

export default AboutPage
