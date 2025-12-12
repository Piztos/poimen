import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ApiKeysModal from './components/ApiKeysModal'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AnalysisPage from './pages/AnalysisPage'
import HistoryPage from './pages/HistoryPage'
import DocumentsPage from './pages/DocumentsPage'
import AboutPage from './pages/AboutPage'
import SettingsPage from './pages/SettingsPage'
import { API_ENDPOINTS } from './config/api'

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [showApiKeysModal, setShowApiKeysModal] = useState(false);

  useEffect(() => {
    // Mostrar modal de API keys se usuário não configurou ainda
    if (isAuthenticated && user && !user.hasConfiguredKeys) {
      setShowApiKeysModal(true);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Marca que a sessão está ativa
    sessionStorage.setItem('poimenSessionActive', 'true')

    // Cleanup ao fechar navegador/aba
    const handleBeforeUnload = async () => {
      const url = API_ENDPOINTS.documentsClearTemp
      const blob = new Blob([JSON.stringify({})], { type: 'application/json' })
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, blob)
      } else {
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
  }, [isAuthenticated])

  return (
    <>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/app" /> : <LandingPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/app" /> : <LoginPage />} />

            {/* Protected routes */}
            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
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
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>

      <ApiKeysModal
        isOpen={showApiKeysModal}
        onClose={() => setShowApiKeysModal(false)}
      />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
