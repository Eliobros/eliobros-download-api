// src/types.js - Constantes e definições de tipos

/**
 * Plataformas suportadas
 */
const PLATFORMS = {
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok', 
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  SPOTIFY: 'spotify'
};

/**
 * Formatos de download suportados
 */
const FORMATS = {
  MP4: 'mp4',
  MP3: 'mp3',
  M4A: 'm4a',
  WAV: 'wav'
};

/**
 * Mensagens de erro padronizadas
 */
const ERRORS = {
  AUTH_REQUIRED: 'Autenticação necessária. Faça login primeiro.',
  API_KEY_REQUIRED: 'API Key necessária. Defina uma API Key primeiro.',
  INVALID_API_KEY: 'API Key inválida.',
  INVALID_URL: 'URL inválida.',
  INVALID_FORMAT: 'Formato de download inválido.',
  UNSUPPORTED_PLATFORM: 'Plataforma não suportada.',
  NETWORK_ERROR: 'Erro de conexão com a API.',
  RATE_LIMIT_EXCEEDED: 'Limite de requisições excedido.',
  FILE_NOT_FOUND: 'Arquivo não encontrado após o download.',
  DOWNLOAD_FAILED: 'Falha no download do conteúdo.'
};

/**
 * Status de download
 */
const DOWNLOAD_STATUS = {
  PENDING: 'pending',
  DOWNLOADING: 'downloading', 
  COMPLETED: 'completed',
  FAILED: 'failed',
  ERROR: 'error'
};

/**
 * Configurações padrão
 */
const DEFAULT_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  TIMEOUT: 180000, // 3 minutos
  RETRIES: 3,
  RETRY_DELAY: 1000,
  BATCH_DELAY: 1000,
  MAX_CONCURRENT_DOWNLOADS: 3
};

/**
 * Patterns regex para detecção de plataformas
 */
const PLATFORM_PATTERNS = {
  [PLATFORMS.YOUTUBE]: [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i
  ],
  [PLATFORMS.TIKTOK]: [
    /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/i,
    /^https?:\/\/(vm|m)\.tiktok\.com\/[\w.-]+/i
  ],
  [PLATFORMS.INSTAGRAM]: [
    /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+/i
  ],
  [PLATFORMS.FACEBOOK]: [
    /^https?:\/\/(www\.)?facebook\.com\/.*\/videos\/\d+/i,
    /^https?:\/\/(www\.)?fb\.watch\/[\w-]+/i
  ],
  [PLATFORMS.SPOTIFY]: [
    /^https?:\/\/open\.spotify\.com\/(track|album|playlist)\/[\w]+/i
  ]
};

/**
 * Informações sobre formatos
 */
const FORMAT_INFO = {
  [FORMATS.MP4]: {
    extension: 'mp4',
    type: 'video',
    description: 'Vídeo MP4 (H.264)',
    mimeType: 'video/mp4'
  },
  [FORMATS.MP3]: {
    extension: 'mp3',
    type: 'audio',
    description: 'Áudio MP3 (192kbps)',
    mimeType: 'audio/mpeg'
  },
  [FORMATS.M4A]: {
    extension: 'm4a',
    type: 'audio', 
    description: 'Áudio AAC M4A',
    mimeType: 'audio/mp4'
  },
  [FORMATS.WAV]: {
    extension: 'wav',
    type: 'audio',
    description: 'Áudio WAV (sem compressão)',
    mimeType: 'audio/wav'
  }
};

/**
 * Informações sobre plataformas
 */
const PLATFORM_INFO = {
  [PLATFORMS.YOUTUBE]: {
    name: 'YouTube',
    domain: 'youtube.com',
    supportedFormats: [FORMATS.MP4, FORMATS.MP3, FORMATS.M4A, FORMATS.WAV],
    maxDuration: null, // Sem limite
    requiresAuth: false
  },
  [PLATFORMS.TIKTOK]: {
    name: 'TikTok',
    domain: 'tiktok.com',
    supportedFormats: [FORMATS.MP4, FORMATS.MP3, FORMATS.M4A],
    maxDuration: 600, // 10 minutos (estimado)
    requiresAuth: false
  },
  [PLATFORMS.INSTAGRAM]: {
    name: 'Instagram',
    domain: 'instagram.com',
    supportedFormats: [FORMATS.MP4, FORMATS.MP3, FORMATS.M4A],
    maxDuration: 3600, // 60 minutos (IGTV)
    requiresAuth: false
  },
  [PLATFORMS.FACEBOOK]: {
    name: 'Facebook', 
    domain: 'facebook.com',
    supportedFormats: [FORMATS.MP4, FORMATS.MP3, FORMATS.M4A],
    maxDuration: null, // Varia
    requiresAuth: false
  },
  [PLATFORMS.SPOTIFY]: {
    name: 'Spotify',
    domain: 'open.spotify.com',
    supportedFormats: [], // Não suportado para download direto
    maxDuration: null,
    requiresAuth: true,
    note: 'Apenas metadados disponíveis'
  }
};

/**
 * Códigos de status HTTP relevantes
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

/**
 * Eventos do cliente
 */
const CLIENT_EVENTS = {
  DOWNLOAD_START: 'download:start',
  DOWNLOAD_PROGRESS: 'download:progress', 
  DOWNLOAD_COMPLETE: 'download:complete',
  DOWNLOAD_ERROR: 'download:error',
  BATCH_START: 'batch:start',
  BATCH_PROGRESS: 'batch:progress',
  BATCH_COMPLETE: 'batch:complete',
  AUTH_SUCCESS: 'auth:success',
  AUTH_ERROR: 'auth:error'
};

module.exports = {
  PLATFORMS,
  FORMATS,
  ERRORS,
  DOWNLOAD_STATUS,
  DEFAULT_CONFIG,
  PLATFORM_PATTERNS,
  FORMAT_INFO,
  PLATFORM_INFO,
  HTTP_STATUS,
  CLIENT_EVENTS
};
