# Downloads

Para realizar downloads, defina `X-API-Key` via `client.setApiKey('SUA_API_KEY')`.

## Download genérico
- Endpoint: `POST /api/download/{platform}` (a plataforma é detectada automaticamente pelo cliente)
- Body:
```json
{ "url": "URL_DO_CONTEUDO", "type": "mp4|mp3|m4a|wav" }
```

### Exemplo (Node.js)
```javascript
const { createClient } = require('eliobros-dl-api');
const client = createClient();
client.setApiKey('SUA_API_KEY');

const result = await client.download('https://www.youtube.com/watch?v=VIDEO_ID', 'mp4');
console.log(result);
```

### Exemplo (cURL)
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: SUA_API_KEY" \
  -d '{"url":"https://www.youtube.com/watch?v=VIDEO_ID","type":"mp4"}' \
  http://93.127.129.84:3001/api/download/youtube
```

## Específicos por plataforma (atalhos do cliente)
- `client.downloadYoutube(url, format)`
- `client.downloadTikTok(url, format)`
- `client.downloadInstagram(url, format)`
- `client.downloadFacebook(url, format)`

## Observações
- Formatos suportados: `mp4`, `mp3`, `m4a`, `wav`
- Erros comuns: `INVALID_URL`, `INVALID_FORMAT`, `UNSUPPORTED_PLATFORM`, `API_KEY_REQUIRED`