import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AnalysisPage from './pages/AnalysisPage'
import HistoryPage from './pages/HistoryPage'
import DocumentsPage from './pages/DocumentsPage'
import AboutPage from './pages/AboutPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  useEffect(() => {
    // Marca que a sessão está ativa
    sessionStorage.setItem('poimenSessionActive', 'true')

    // Cleanup ao fechar navegador/aba
    const handleBeforeUnload = async () => {
      // Usa sendBeacon para garantir que a requisição seja enviada
      const url = API_ENDPOINTS.documentsClearTemp
      const blob = new Blob([JSON.stringify({})], { type: 'application/json' })
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, blob)
      } else {
        // Fallback para navegadores antigos
        fetch(url, {
          method: 'DELETE',
          keepalive: true
        }).catch(() => {})
      }
      
      sessionStorage.removeItem('poimenSessionActive')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
