# Estatísticas

Retorna estatísticas da API Key atual.

- Endpoint: `GET /api/stats`
- Header: `X-API-Key: SUA_API_KEY`

### Exemplo (Node.js)
```javascript
const { createClient } = require('eliobros-dl-api');
const client = createClient();
client.setApiKey('SUA_API_KEY');

const stats = await client.getStats();
console.log(stats);
```

### Exemplo (cURL)
```bash
curl -H "X-API-Key: SUA_API_KEY" http://93.127.129.84:3001/api/stats
```