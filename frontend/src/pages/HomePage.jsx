import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Sparkles, CheckCircle, Zap } from 'lucide-react'
import './HomePage.css'

function HomePage() {
  const features = [
    {
      icon: <Sparkles size={32} />,
      title: '5 IAs Gratuitas - 100% Automáticas',
      description: 'Gemini 1.5, Groq, Mistral, OpenRouter, Perplexity - todas respondem automaticamente!'
    },
    {
      icon: <BookOpen size={32} />,
      title: 'Teologia Reformada',
      description: 'Baseado nos maiores mestres reformados: Calvino, Spurgeon, Piper, Keller e mais'
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Análise Profunda',
      description: 'Exegese histórica, gramatical, literária e sistemática de cada perícope'
    },
    {
      icon: <Zap size={32} />,
      title: 'Multiplataforma',
      description: 'Funciona em Web, Windows, Linux, macOS, Android e iOS'
    }
  ]

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Poimén
            <span className="hero-subtitle">ποιμήν</span>
          </h1>
          <p className="hero-description">
            Construtor do Conhecimento Teológico
          </p>
          <p className="hero-text">
            Sistema completo de estudos bíblicos reformados com múltiplas IAs gratuitas.
            Análise profunda, exegética e prática da Palavra de Deus.
          </p>
          <Link to="/analysis" className="btn btn-primary btn-hero">
            <BookOpen size={24} />
            Começar Análise
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Recursos do Sistema</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works-section">
        <h2 className="section-title">Como Funciona</h2>
        <div className="steps-container">
          <div className="step card">
            <div className="step-number">1</div>
            <h3>Insira o Texto Bíblico</h3>
            <p>Digite ou cole a perícope que deseja analisar (versão NVI recomendada)</p>
          </div>
          <div className="step card">
            <div className="step-number">2</div>
            <h3>Escolha as IAs</h3>
            <p>Selecione de 1 a 5 IAs (configure API keys gratuitas na primeira vez)</p>
          </div>
          <div className="step card">
            <div className="step-number">3</div>
            <h3>Aguarde Análises Automáticas</h3>
            <p>Todas as IAs respondem automaticamente em paralelo - sem interação manual!</p>
          </div>
          <div className="step card">
            <div className="step-number">4</div>
            <h3>Exporte Resultados</h3>
            <p>Salve em PDF, DOCX, Google Docs, Markdown ou texto simples</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content card">
          <h2>Pronto para Estudar a Palavra?</h2>
          <p>Comece agora sua jornada de análise bíblica profunda e reformada</p>
          <Link to="/analysis" className="btn btn-primary btn-large">
            <BookOpen size={24} />
            Iniciar Análise Bíblica
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
