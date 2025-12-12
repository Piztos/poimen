import React from 'react'
import { Heart, Github } from 'lucide-react'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            Feito com <Heart size={16} className="heart-icon" /> para a glória de Deus
          </p>
          <p className="footer-copyright">
            © {currentYear} Poimén - Sistema de Estudos Bíblicos Reformados
          </p>
        </div>
        
        <div className="footer-links">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
