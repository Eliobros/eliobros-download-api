# Introdução

A Eliobros DL API é um cliente JavaScript/TypeScript para integração com a API de download multi-plataforma (YouTube, TikTok, Instagram, Facebook).

- Pacote: `eliobros-dl-api`
- Base URL padrão: `http://93.127.129.84:3001`
- Requer `X-API-Key` para downloads e estatísticas

## Instalação
```bash
npm install eliobros-dl-api
```

## Quickstart
```javascript
const { createClient } = require('eliobros-dl-api');

const client = createClient();
client.setApiKey('SUA_API_KEY');

(async () => {
  const result = await client.download('https://www.youtube.com/watch?v=VIDEO_ID', 'mp4');
  console.log(result);
})();
```

## Funções principais
- `createClient(baseURL?)` → instancia o cliente (baseURL opcional)
- `client.setApiKey(apiKey)` → define a API Key
- `client.download(url, format)` → download genérico (detecta plataforma)
- `client.getStats()` → estatísticas de uso da API Key

## Formatos suportados
- Vídeo: `mp4`
- Áudio: `mp3`, `m4a`, `wav`

## Plataformas suportadas
- YouTube, TikTok, Instagram, Facebook