# Erros

Erros padronizados expostos pelo cliente:

- `AUTH_REQUIRED`: Autenticação necessária
- `API_KEY_REQUIRED`: API Key ausente
- `INVALID_API_KEY`: API Key inválida
- `INVALID_URL`: URL inválida
- `INVALID_FORMAT`: Formato inválido
- `UNSUPPORTED_PLATFORM`: Plataforma não suportada
- `NETWORK_ERROR`: Erro de conexão
- `RATE_LIMIT_EXCEEDED`: Limite excedido
- `FILE_NOT_FOUND`: Arquivo não encontrado
- `DOWNLOAD_FAILED`: Falha no download

Tratamento básico:
```javascript
try {
  const res = await client.download(url, 'mp4');
} catch (e) {
  console.error(e.message);
}
```