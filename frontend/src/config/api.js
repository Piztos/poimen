// Configuração da URL da API
// Em produção, use a variável de ambiente VITE_API_URL
// Em desenvolvimento, usa localhost:5000
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const API_ENDPOINTS = {
  documents: `${API_BASE_URL}/api/documents`,
  documentsUpload: `${API_BASE_URL}/api/documents/upload`,
  documentById: (id) => `${API_BASE_URL}/api/documents/${id}`,
  documentsClearTemp: `${API_BASE_URL}/api/documents/temporary/clear`,
  documentsSearch: `${API_BASE_URL}/api/documents/search`,
  health: `${API_BASE_URL}/api/health`
}
