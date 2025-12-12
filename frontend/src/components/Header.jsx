import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Home, Clock, FileText, Info, Settings } from 'lucide-react'
import './Header.css'

function Header() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <BookOpen size={32} />
          <span className="header-title">Poimén</span>
        </Link>
        
        <nav className="header-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <Home size={20} />
            <span>Início</span>
          </Link>
          <Link 
            to="/analysis" 
            className={`nav-link ${isActive('/analysis') ? 'active' : ''}`}
          >
            <BookOpen size={20} />
            <span>Análise</span>
          </Link>
          <Link 
            to="/documents" 
            className={`nav-link ${isActive('/documents') ? 'active' : ''}`}
          >
            <FileText size={20} />
            <span>Documentos</span>
          </Link>
          <Link 
            to="/history" 
            className={`nav-link ${isActive('/history') ? 'active' : ''}`}
          >
            <Clock size={20} />
            <span>Histórico</span>
          </Link>
          <Link 
            to="/settings" 
            className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
          >
            <Settings size={20} />
            <span>Config</span>
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            <Info size={20} />
            <span>Sobre</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
