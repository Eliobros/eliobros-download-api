# Eliobros DL API — Documentação

Cliente JavaScript/TypeScript para a API de download multi-plataforma (YouTube, TikTok, Instagram, Facebook).

- Pacote npm: `eliobros-dl-api`
- Base URL padrão: `http://93.127.129.84:3001`
- Autenticação:
  - `X-API-Key`: downloads e estatísticas
  - `Authorization: Bearer <token>`: endpoints administrativos (auth/keys)

## Conteúdo
- `introducao.md`: Instalação, quickstart e exemplos básicos
- `autenticacao.md`: Registro e login (JWT)
- `chaves.md`: Gerenciamento de API Keys
- `downloads.md`: Endpoints e exemplos de download
- `estatisticas.md`: Uso de `/api/stats`
- `erros.md`: Códigos e mensagens de erro
- `openapi.yaml`: Especificação OpenAPI

## Instalação rápida
```bash
npm install eliobros-dl-api
```

## Exemplo rápido
```javascript
const { createClient } = require('eliobros-dl-api');

const client = createClient();
client.setApiKey('SUA_API_KEY');

(async () => {
  const result = await client.download('https://www.youtube.com/watch?v=VIDEO_ID', 'mp4');
  console.log(result);
})();
```