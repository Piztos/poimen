import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Home, Clock, FileText, Info, Settings, LogOut, Key } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ApiKeysModal from './ApiKeysModal'
import './Header.css'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showApiKeysModal, setShowApiKeysModal] = useState(false)

  const isActive = (path) => location.pathname === `/app${path}`

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/app" className="header-logo">
            <BookOpen size={32} />
            <span className="header-title">Poimén</span>
          </Link>
          
          <nav className="header-nav">
            <Link 
              to="/app" 
              className={`nav-link ${isActive('') || isActive('/') ? 'active' : ''}`}
            >
              <Home size={20} />
              <span>Início</span>
            </Link>
            <Link 
              to="/app/analysis" 
              className={`nav-link ${isActive('/analysis') ? 'active' : ''}`}
            >
              <BookOpen size={20} />
              <span>Análise</span>
            </Link>
            <Link 
              to="/app/documents" 
              className={`nav-link ${isActive('/documents') ? 'active' : ''}`}
            >
              <FileText size={20} />
              <span>Documentos</span>
            </Link>
            <Link 
              to="/app/history" 
              className={`nav-link ${isActive('/history') ? 'active' : ''}`}
            >
              <Clock size={20} />
              <span>Histórico</span>
            </Link>
            <Link 
              to="/app/settings" 
              className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
            >
              <Settings size={20} />
              <span>Config</span>
            </Link>
            <Link 
              to="/app/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              <Info size={20} />
              <span>Sobre</span>
            </Link>

            <button
              onClick={() => setShowApiKeysModal(true)}
              className="nav-link"
              title="Configurar API Keys"
            >
              <Key size={20} />
              <span>APIs</span>
            </button>

            <button
              onClick={handleLogout}
              className="nav-link"
              title="Sair"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </nav>
        </div>
      </header>

      <ApiKeysModal
        isOpen={showApiKeysModal}
        onClose={() => setShowApiKeysModal(false)}
      />
    </>
  )
}

export default Header
