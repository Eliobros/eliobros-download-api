# Autenticação

Algumas operações administrativas (gerenciamento de API Keys) usam JWT no header `Authorization: Bearer <token>`.

Os downloads e estatísticas usam `X-API-Key`.

## Registro (register)
- Endpoint: `POST /auth/register`
- Body:
```json
{
  "username": "seu_usuario",
  "email": "seu@email.com",
  "password": "sua_senha"
}
```
- Resposta (exemplo):
```json
{
  "success": true,
  "userId": "..."
}
```

## Login
- Endpoint: `POST /auth/login`
- Body:
```json
{
  "username": "seu_usuario",
  "password": "sua_senha"
}
```
- Resposta (exemplo):
```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "userId": "..."
}
```

Após o login, use `Authorization: Bearer JWT_TOKEN` para rotas de chaves.