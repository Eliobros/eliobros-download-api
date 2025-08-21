// src/client.js - Cliente principal da biblioteca eliobros-download-api
const axios = require('axios');
const { PLATFORMS, FORMATS, ERRORS } = require('./types');
const { validateUrl, detectPlatform, formatFileSize } = require('./utils');

/**
 * Cliente para a Eliobros Download API
 */
class EliobrosDownloadClient {
  /**
   * @param {string} baseURL - URL base da API (padrão: http://localhost:3000)
   * @param {Object} options - Opções adicionais
   */
  constructor(baseURL = 'http://93.127.129.84:3001', options = {}) {
    this.baseURL = baseURL;
    this.token = null;
    this.apiKey = null;
    this.options = {
      timeout: 180000, // 3 minutos
      retries: 3,
      retryDelay: 1000,
      ...options
    };
    
    // Configurar axios
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: this.options.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'eliobros-download-api/1.0.0'
      }
    });

    // Interceptors
    this._setupInterceptors();
  }

  /**
   * Configurar interceptors do axios
   * @private
   */
  _setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use((config) => {
      // Adicionar token JWT para rotas de gerenciamento
      if (this.token && (
        config.url.startsWith('/api/keys') || 
        config.url.startsWith('/auth/')
      )) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      
      // Adicionar API Key para rotas de download
      if (this.apiKey && (
        config.url.startsWith('/api/download') || 
        config.url === '/api/stats'
      )) {
        config.headers['X-API-Key'] = this.apiKey;
      }
      
      return config;
    });

    // Response interceptor para retry automático
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        
        if (!config || config.__isRetryRequest) {
          return Promise.reject(error);
        }
        
        config.__retryCount = config.__retryCount || 0;
        
        if (config.__retryCount >= this.options.retries) {
          return Promise.reject(error);
        }
        
        config.__retryCount++;
        config.__isRetryRequest = true;
        
        // Aguardar antes de tentar novamente
        await new Promise(resolve => 
          setTimeout(resolve, this.options.retryDelay * config.__retryCount)
        );
        
        return this.api(config);
      }
    );
  }

  // ========== AUTENTICAÇÃO ==========

  /**
   * Registrar novo usuário
   * @param {string} username - Nome de usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha
   * @returns {Promise<Object>} Resultado do registro
   */
  async register(username, email, password) {
    try {
      const response = await this.api.post('/auth/register', {
        username,
        email,
        password
      });
      return { success: true, ...response.data };
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro no registro');
    }
  }

  /**
   * Fazer login na API
   * @param {string} username - Nome de usuário
   * @param {string} password - Senha
   * @returns {Promise<Object>} Dados do login (token, userId)
   */
  async login(username, password) {
    try {
      const response = await this.api.post('/auth/login', {
        username,
        password
      });
      
      this.token = response.data.token;
      return { success: true, ...response.data };
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro no login');
    }
  }

  /**
   * Fazer logout (limpa o token)
   */
  logout() {
    this.token = null;
    this.apiKey = null;
  }

  // ========== GERENCIAMENTO DE API KEYS ==========

  /**
   * Gerar nova API Key
   * @param {string} keyName - Nome para identificar a chave
   * @returns {Promise<Object>} Dados da API Key gerada
   */
  async generateApiKey(keyName) {
    if (!this.token) {
      throw new Error(ERRORS.AUTH_REQUIRED);
    }

    try {
      const response = await this.api.post('/api/keys/generate', { keyName });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao gerar API Key');
    }
  }

  /**
   * Listar API Keys do usuário
   * @returns {Promise<Array>} Lista de API Keys
   */
  async listApiKeys() {
    if (!this.token) {
      throw new Error(ERRORS.AUTH_REQUIRED);
    }

    try {
      const response = await this.api.get('/api/keys');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao listar API Keys');
    }
  }

  /**
   * Desativar uma API Key
   * @param {string} keyId - ID da API Key
   * @returns {Promise<Object>} Resultado da operação
   */
  async deactivateApiKey(keyId) {
    if (!this.token) {
      throw new Error(ERRORS.AUTH_REQUIRED);
    }

    try {
      const response = await this.api.put(`/api/keys/${keyId}/deactivate`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao desativar API Key');
    }
  }

  /**
   * Definir API Key para downloads
   * @param {string} apiKey - Chave da API
   */
  setApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error(ERRORS.INVALID_API_KEY);
    }
    this.apiKey = apiKey;
  }

  // ========== DOWNLOADS ==========

  /**
   * Download genérico - detecta plataforma automaticamente
   * @param {string} url - URL do conteúdo
   * @param {string} format - Formato de download (mp4, mp3, m4a, wav)
   * @returns {Promise<Object>} Resultado do download
   */
  async download(url, format = FORMATS.MP4) {
    if (!this.apiKey) {
      throw new Error(ERRORS.API_KEY_REQUIRED);
    }

    // Validar URL
    if (!validateUrl(url)) {
      throw new Error(ERRORS.INVALID_URL);
    }

    // Validar formato
    if (!Object.values(FORMATS).includes(format)) {
      throw new Error(ERRORS.INVALID_FORMAT);
    }

    // Detectar plataforma
    const platform = detectPlatform(url);
    if (!platform) {
      throw new Error(ERRORS.UNSUPPORTED_PLATFORM);
    }

    try {
      const response = await this.api.post(`/api/download/${platform}`, {
        url,
        type: format
      });

      const result = response.data;
      
      // Adicionar informações úteis ao resultado
      if (result.success && result.file_size) {
        result.formatted_size = formatFileSize(result.file_size);
      }
      
      return result;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro no download');
    }
  }

  /**
   * Download específico do YouTube
   * @param {string} url - URL do YouTube
   * @param {string} format - Formato de download
   * @returns {Promise<Object>} Resultado do download
   */
  async downloadYoutube(url, format = FORMATS.MP4) {
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      throw new Error('URL deve ser do YouTube');
    }
    return this.download(url, format);
  }

  /**
   * Download específico do TikTok
   * @param {string} url - URL do TikTok
   * @param {string} format - Formato de download
   * @returns {Promise<Object>} Resultado do download
   */
  async downloadTikTok(url, format = FORMATS.MP4) {
    if (!url.includes('tiktok.com')) {
      throw new Error('URL deve ser do TikTok');
    }
    return this.download(url, format);
  }

  /**
   * Download específico do Instagram
   * @param {string} url - URL do Instagram
   * @param {string} format - Formato de download
   * @returns {Promise<Object>} Resultado do download
   */
  async downloadInstagram(url, format = FORMATS.MP4) {
    if (!url.includes('instagram.com')) {
      throw new Error('URL deve ser do Instagram');
    }
    return this.download(url, format);
  }

  /**
   * Download específico do Facebook
   * @param {string} url - URL do Facebook
   * @param {string} format - Formato de download
   * @returns {Promise<Object>} Resultado do download
   */
  async downloadFacebook(url, format = FORMATS.MP4) {
    if (!url.includes('facebook.com')) {
      throw new Error('URL deve ser do Facebook');
    }
    return this.download(url, format);
  }

  // ========== ESTATÍSTICAS ==========

  /**
   * Obter estatísticas da API Key atual
   * @returns {Promise<Object>} Estatísticas de uso
   */
  async getStats() {
    if (!this.apiKey) {
      throw new Error(ERRORS.API_KEY_REQUIRED);
    }

    try {
      const response = await this.api.get('/api/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao obter estatísticas');
    }
  }

  // ========== UTILITÁRIOS ==========

  /**
   * Testar conexão com a API
   * @returns {Promise<boolean>} Status da conexão
   */
  async ping() {
    try {
      const response = await axios.get(`${this.baseURL}/api/stats`, { 
        timeout: 5000,
        headers: { 'X-API-Key': this.apiKey || 'test' }
      });
      return response.status === 200 || response.status === 401; // 401 é esperado sem API key
    } catch (error) {
      return false;
    }
  }

  /**
   * Obter informações sobre a API
   * @returns {Object} Informações da configuração atual
   */
  getInfo() {
    return {
      baseURL: this.baseURL,
      hasToken: !!this.token,
      hasApiKey: !!this.apiKey,
      timeout: this.options.timeout,
      retries: this.options.retries,
      supportedPlatforms: Object.values(PLATFORMS),
      supportedFormats: Object.values(FORMATS)
    };
  }
}

module.exports = EliobrosDownloadClient;
