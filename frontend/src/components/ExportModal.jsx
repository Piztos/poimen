import React, { useState } from 'react'
import { X, Download, FileText, File } from 'lucide-react'
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import html2pdf from 'html2pdf.js'
import { marked } from 'marked'
import './ExportModal.css'

function ExportModal({ results, biblicalText, onClose }) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState('txt')

  const generateContent = () => {
    let content = `ANÁLISE BÍBLICA POIMÉN\n`
    content += `${'='.repeat(50)}\n\n`
    content += `TEXTO BÍBLICO:\n${biblicalText}\n\n`
    content += `${'='.repeat(50)}\n\n`

    results.forEach((result, index) => {
      content += `\n${'-'.repeat(50)}\n`
      content += `${result.icon} ${result.aiName}\n`
      content += `${'-'.repeat(50)}\n\n`
      content += result.content || 'Sem conteúdo disponível'
      content += `\n\n`
    })

    content += `\n${'='.repeat(50)}\n`
    content += `Gerado por Poimén - ${new Date().toLocaleString('pt-BR')}\n`

    return content
  }

  const exportToTxt = () => {
    const content = generateContent()
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `analise-poimen-${Date.now()}.txt`)
  }

  const exportToMarkdown = () => {
    let content = `# ANÁLISE BÍBLICA POIMÉN\n\n`
    content += `## Texto Bíblico\n\n${biblicalText}\n\n`
    content += `---\n\n`

    results.forEach((result) => {
      content += `## ${result.icon} ${result.aiName}\n\n`
      content += result.content || '*Sem conteúdo disponível*'
      content += `\n\n---\n\n`
    })

    content += `\n*Gerado por Poimén - ${new Date().toLocaleString('pt-BR')}*\n`

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    saveAs(blob, `analise-poimen-${Date.now()}.md`)
  }

  const exportToPdf = async () => {
    const content = generateContent()
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.8;
            padding: 40px;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            text-align: center;
            color: #1a1a2e;
            border-bottom: 3px solid #533483;
            padding-bottom: 10px;
          }
          h2 {
            color: #533483;
            margin-top: 30px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 5px;
          }
          .biblical-text {
            background: #f5f5f5;
            padding: 20px;
            border-left: 5px solid #533483;
            margin: 20px 0;
            font-style: italic;
          }
          .result-section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            color: #666;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <h1>ANÁLISE BÍBLICA POIMÉN</h1>
        <div class="biblical-text">
          <h2>Texto Bíblico</h2>
          <p>${biblicalText.replace(/\n/g, '<br>')}</p>
        </div>
        ${results.map(result => `
          <div class="result-section">
            <h2>${result.icon} ${result.aiName}</h2>
            ${marked.parse(result.content || '*Sem conteúdo disponível*')}
          </div>
        `).join('')}
        <div class="footer">
          Gerado por Poimén - ${new Date().toLocaleString('pt-BR')}
        </div>
      </body>
      </html>
    `

    const element = document.createElement('div')
    element.innerHTML = htmlContent

    const options = {
      margin: 10,
      filename: `analise-poimen-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    await html2pdf().set(options).from(element).save()
  }

  const exportToDocx = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: 'ANÁLISE BÍBLICA POIMÉN',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: 'Texto Bíblico',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: biblicalText,
            spacing: { after: 300 }
          }),
          ...results.flatMap(result => [
            new Paragraph({
              text: `${result.icon} ${result.aiName}`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 }
            }),
            new Paragraph({
              text: result.content || 'Sem conteúdo disponível',
              spacing: { after: 200 }
            })
          ]),
          new Paragraph({
            text: `Gerado por Poimén - ${new Date().toLocaleString('pt-BR')}`,
            spacing: { before: 400 }
          })
        ]
      }]
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `analise-poimen-${Date.now()}.docx`)
  }

  const exportToGoogleDocs = () => {
    const content = generateContent()
    const encodedContent = encodeURIComponent(content)
    const url = `https://docs.google.com/document/create?title=Análise%20Poimén%20${Date.now()}&body=${encodedContent}`
    window.open(url, '_blank')
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      switch (exportFormat) {
        case 'txt':
          exportToTxt()
          break
        case 'md':
          exportToMarkdown()
          break
        case 'pdf':
          await exportToPdf()
          break
        case 'docx':
          await exportToDocx()
          break
        case 'gdocs':
          exportToGoogleDocs()
          break
        default:
          throw new Error('Formato não suportado')
      }
    } catch (error) {
      alert('Erro ao exportar: ' + error.message)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Exportar Resultados</h2>
          <button onClick={onClose} className="btn-icon">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Escolha o formato para exportar os resultados da análise bíblica
          </p>

          <div className="export-options">
            <label className={`export-option ${exportFormat === 'txt' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="exportFormat"
                value="txt"
                checked={exportFormat === 'txt'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <div className="option-content">
                <FileText size={32} />
                <div>
                  <h4>Texto Simples (.txt)</h4>
                  <p>Formato universal, sem formatação</p>
                </div>
              </div>
            </label>

            <label className={`export-option ${exportFormat === 'md' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="exportFormat"
                value="md"
                checked={exportFormat === 'md'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <div className="option-content">
                <File size={32} />
                <div>
                  <h4>Markdown (.md)</h4>
                  <p>Formatação leve para desenvolvedores</p>
                </div>
              </div>
            </label>

            <label className={`export-option ${exportFormat === 'pdf' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="exportFormat"
                value="pdf"
                checked={exportFormat === 'pdf'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <div className="option-content">
                <FileText size={32} />
                <div>
                  <h4>PDF (.pdf)</h4>
                  <p>Documento portátil com formatação</p>
                </div>
              </div>
            </label>

            <label className={`export-option ${exportFormat === 'docx' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="exportFormat"
                value="docx"
                checked={exportFormat === 'docx'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <div className="option-content">
                <FileText size={32} />
                <div>
                  <h4>Word (.docx)</h4>
                  <p>Editável no Microsoft Word</p>
                </div>
              </div>
            </label>

            <label className={`export-option ${exportFormat === 'gdocs' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="exportFormat"
                value="gdocs"
                checked={exportFormat === 'gdocs'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <div className="option-content">
                <FileText size={32} />
                <div>
                  <h4>Google Docs</h4>
                  <p>Abre novo documento no Google Docs</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button 
            onClick={handleExport} 
            disabled={isExporting}
            className="btn btn-primary"
          >
            <Download size={20} />
            {isExporting ? 'Exportando...' : 'Exportar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
