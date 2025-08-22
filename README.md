# 🚀 eliobros-dl-api

[![npm version](https://img.shields.io/npm/v/eliobros-dl-api.svg?color=blue)](https://www.npmjs.com/package/eliobros-dl-api)
[![downloads](https://img.shields.io/npm/dt/eliobros-dl-api.svg?color=green)](https://www.npmjs.com/package/eliobros-dl-api)
[![license](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

Biblioteca oficial da **Eliobros Tech** para integração com a **Download API**.  
Permite baixar conteúdos de forma rápida ou em lote, detectar plataformas e gerenciar downloads de forma simples.

---

## 📦 Instalação

```bash
npm install eliobros-dl-api


---

🔑 Configuração da API Key

const { createClient } = require("eliobros-dl-api");

const client = createClient();
client.setApiKey("SUA_API_KEY_AQUI");


---

⚡ Exemplos de Uso

🔹 Quick Download

const { quickDownload } = require("eliobros-dl-api");

(async () => {
  try {
    const result = await quickDownload("https://www.youtube.com/watch?v=abc123");
    console.log(result);
  } catch (err) {
    console.error("Erro:", err.message);
  }
})();

🔹 Batch Download

const { batchDownload } = require("eliobros-dl-api");

(async () => {
  const urls = [
    "https://www.youtube.com/watch?v=abc123",
    "https://www.youtube.com/watch?v=xyz456"
  ];

  try {
    const results = await batchDownload(urls);
    console.log(results);
  } catch (err) {
    console.error("Erro:", err.message);
  }
})();


---

🛠️ API do Client

createClient()

Cria um novo cliente para interação com a API.

Métodos do Client:

client.download(url) → Faz o download de um conteúdo.

client.setApiKey(key) → Define sua API Key.

client.detectPlatform(url) → Detecta a plataforma de uma URL.
⚠️ Requer API Key.



---

📂 Exemplo Completo

const { createClient } = require("eliobros-dl-api");

const client = createClient();
client.setApiKey("SUA_API_KEY");

(async () => {
  try {
    const data = await client.download("https://www.youtube.com/watch?v=abc123");
    console.log("Resultado:", data);
  } catch (err) {
    console.error("Erro:", err.message);
  }
})();


---

⚠️ Tratamento de Erros

Se não definir API Key, métodos restritos irão lançar:

Erro: API Key é obrigatória



---

👨‍💻 Autor

Desenvolvido por Habibo Salimo Julio – CEO da Eliobros Tech


---

📜 Licença

MIT © Eliobros Tech

