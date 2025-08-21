// src/index.js - Ponto de entrada principal da biblioteca eliobros-download-api
const EliobrosDownloadClient = require('./client');
const { PLATFORMS, FORMATS, ERRORS } = require('./types');
const { validateUrl, detectPlatform, formatFileSize } = require('./utils');

/**
 * Função factory para criar uma instância do cliente
 * @param {string} baseURL - URL base da API (opcional)
 * @returns {EliobrosDownloadClient} Instância do cliente
 */
function createClient(baseURL) {
  return new EliobrosDownloadClient(baseURL);
}

/**
 * Função de conveniência para download rápido
 * @param {Object} config - Configuração de download
 * @param {string} config.url - URL do conteúdo
 * @param {string} config.apiKey - Chave da API
 * @param {string} config.format - Formato do download (mp4, mp3, etc.)
 * @param {string} config.baseURL - URL base da API (opcional)
 * @returns {Promise<Object>} Resultado do download
 */
async function quickDownload({ url, apiKey, format = 'mp4', baseURL }) {
  const client = createClient(baseURL);
  client.setApiKey(apiKey);
  
  return await client.download(url, format);
}

/**
 * Função para download em lote
 * @param {Object} config - Configuração do batch
 * @param {string[]} config.urls - Array de URLs
 * @param {string} config.apiKey - Chave da API
 * @param {string} config.format - Formato do download
 * @param {string} config.baseURL - URL base da API (opcional)
 * @param {number} config.delay - Delay entre downloads em ms (padrão: 1000)
 * @param {Function} config.onProgress - Callback de progresso (opcional)
 * @returns {Promise<Object[]>} Array com resultados dos downloads
 */
async function batchDownload({ 
  urls, 
  apiKey, 
  format = 'mp4', 
  baseURL, 
  delay = 1000,
  onProgress 
}) {
  const client = createClient(baseURL);
  client.setApiKey(apiKey);
  
  const results = [];
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    
    try {
      if (onProgress) {
        onProgress({ current: i + 1, total: urls.length, url, status: 'downloading' });
      }
      
      const result = await client.download(url, format);
      results.push({ url, ...result });
      
      if (onProgress) {
        onProgress({ 
          current: i + 1, 
          total: urls.length, 
          url, 
          status: result.success ? 'completed' : 'failed',
          result 
        });
      }
      
      // Delay entre downloads para evitar rate limiting
      if (i < urls.length - 1 && delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
    } catch (error) {
      const errorResult = { url, success: false, error: error.message };
      results.push(errorResult);
      
      if (onProgress) {
        onProgress({ 
          current: i + 1, 
          total: urls.length, 
          url, 
          status: 'error',
          result: errorResult
        });
      }
    }
  }
  
  return results;
}

// Exportações principais
module.exports = {
  // Classe principal
  EliobrosDownloadClient,
  
  // Funções de conveniência
  createClient,
  quickDownload,
  batchDownload,
  
  // Constantes e utilitários
  PLATFORMS,
  FORMATS,
  ERRORS,
  validateUrl,
  detectPlatform,
  formatFileSize,
  
  // Alias para compatibilidade
  Client: EliobrosDownloadClient,
  DownloadClient: EliobrosDownloadClient
};
