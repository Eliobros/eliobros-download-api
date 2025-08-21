# API Keys

Operações exigem JWT em `Authorization: Bearer <token>`.

## Gerar API Key
- Endpoint: `POST /api/keys/generate`
- Body:
```json
{ "keyName": "meu-ambiente" }
```
- Resposta (exemplo):
```json
{
  "keyId": "...",
  "apiKey": "...",
  "active": true,
  "createdAt": "..."
}
```

## Listar API Keys
- Endpoint: `GET /api/keys`
- Resposta: array de chaves do usuário autenticado

## Desativar API Key
- Endpoint: `PUT /api/keys/{keyId}/deactivate`
- Resposta (exemplo):
```json
{ "keyId": "...", "active": false }
```