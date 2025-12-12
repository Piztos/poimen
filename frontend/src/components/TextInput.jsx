import React from 'react'
import { FileText, Compass } from 'lucide-react'
import './TextInput.css'

function TextInput({ value, onChange, disabled, userGuidance, onGuidanceChange }) {
  return (
    <div className="text-input-container">
      <label htmlFor="biblical-text" className="input-label">
        <FileText size={20} />
        <span>Texto Bíblico (NVI recomendada)</span>
      </label>
      <textarea
        id="biblical-text"
        className="biblical-text-input"
        placeholder="Digite ou cole a perícope que deseja estudar. O agente Poimén realizará análise completa."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={12}
      />
      
      <label htmlFor="user-guidance" className="input-label guidance-label">
        <Compass size={20} />
        <span>Direcionamento Opcional</span>
        <span className="optional-badge">Opcional</span>
      </label>
      <textarea
        id="user-guidance"
        className="user-guidance-input"
        placeholder="Se quiser fazer alguma interação inicial com o Poimén digite aqui..."
        value={userGuidance}
        onChange={(e) => onGuidanceChange(e.target.value)}
        disabled={disabled}
        rows={4}
      />
      <div className="input-info">
        <p>💡 Use o campo de direcionamento para guiar a análise com suas observações pessoais, estrutura de sermão ou pontos específicos que deseja explorar.</p>
      </div>
    </div>
  )
}

export default TextInput
