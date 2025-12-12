import React, { useState } from 'react'
import { Key, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import ApiKeysModal from '../components/ApiKeysModal'
import './SettingsPage.css'

function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showApiKeysModal, setShowApiKeysModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <div className="settings-page">
        <div className="settings-container">
          <div className="settings-header">
            <h1>
              <User size={32} />
              Configurações
            </h1>
          </div>

          <div className="settings-section">
            <h2>👤 Conta</h2>
            <div className="info-card">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Conta criada em:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
              <p><strong>Status API Keys:</strong> {user?.hasConfiguredKeys ? '✅ Configuradas' : '⚠️ Não configuradas'}</p>
            </div>
          </div>

          <div className="settings-section">
            <h2>🔑 API Keys</h2>
            <div className="info-card">
              <p>Suas chaves de API ficam criptografadas e são usadas apenas quando você faz análises.</p>
              <button 
                onClick={() => setShowApiKeysModal(true)}
                className="primary-button"
              >
                <Key size={20} />
                Configurar / Atualizar API Keys
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h2>🚪 Sair</h2>
            <div className="info-card">
              <button 
                onClick={handleLogout}
                className="danger-button"
              >
                <LogOut size={20} />
                Sair da Conta
              </button>
            </div>
          </div>
        </div>
      </div>

      <ApiKeysModal
        isOpen={showApiKeysModal}
        onClose={() => setShowApiKeysModal(false)}
      />
    </>
  )
}

export default SettingsPage
