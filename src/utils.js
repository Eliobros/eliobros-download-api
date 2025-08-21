// src/utils.js - Funções utilitárias da biblioteca

const { PLATFORMS, PLATFORM_PATTERNS, FORMATS } = require('./types');

/**
 * Validar se uma URL é válida
 * @param {string} url - URL para validar
 * @returns {boolean} True se a URL é válida
 */
function validateUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Detectar a plataforma de uma URL
 * @param {string} url - URL para analisar
 * @returns {string|null} Nome da plataforma ou null se não suportada
 */
function detectPlatform(url) {
  if (!validateUrl(url)) return null;
  for (const [platform, patterns] of Object.entries(PLATFORM_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(url)) return platform;
    }
  }
  return null;
}

/**
 * Formatar tamanho de arquivo em formato legível
 * @param {number} bytes - Tamanho em bytes
 * @param {number} decimals - Número de casas decimais (padrão: 2)
 * @returns {string} Tamanho formatado (ex: "1.5 MB")
 */
function formatFileSize(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Extrair ID ou identificador de vídeo/música de uma URL
 * @param {string} url - URL da plataforma
 * @returns {{ platform: string, id: string|null }} Objeto com plataforma e ID
 */
function extractIdFromUrl(url) {
  const platform = detectPlatform(url);
  if (!platform) return { platform: null, id: null };

  let id = null;

  switch (platform) {
    case PLATFORMS.YOUTUBE:
      {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        id = match ? match[1] : null;
      }
      break;

    case PLATFORMS.TIKTOK:
      {
        const match = url.match(/video\/(\d+)/i);
        id = match ? match[1] : null;
      }
      break;

    case PLATFORMS.INSTAGRAM:
      {
        const match = url.match(/instagram\.com\/(p|reel|tv)\/([\w-]+)/i);
        id = match ? match[2] : null;
      }
      break;

    case PLATFORMS.FACEBOOK:
      {
        const match = url.match(/videos\/(\d+)/i);
        id = match ? match[1] : null;
      }
      break;

    case PLATFORMS.SPOTIFY:
      {
        const match = url.match(/spotify\.com\/(track|album|playlist)\/([\w]+)/i);
        id = match ? match[2] : null;
      }
      break;

    default:
      id = null;
  }

  return { platform, id };
}

module.exports = {
  validateUrl,
  detectPlatform,
  formatFileSize,
  extractIdFromUrl
};
